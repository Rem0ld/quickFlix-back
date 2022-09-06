import fetch from "node-fetch";
import path from "path";
import { basePath, movieDbUrl } from "../../config/defaultConfig";
import { logger } from "../../libs/logger";
import {
  getGenres,
  getImages,
  getTvShowDetails,
  getVideoPath,
} from "../../services/apiService";
import { err, MissingDataPayloadException, ok } from "../../services/Error";
import { go } from "../../services/miscelleneaous";
import { promisifier } from "../../services/promisifier";
import { Result } from "../../types";
import { accessFolder } from "../../utils/fileManipulation";
import {
  regExBasename,
  regexTvShow,
  regexVideo,
  regexYearDate,
} from "../../utils/regexes";
import { parseBasename } from "../../utils/stringManipulation";
import { jobStatusType } from "../EncodingJob/EncodingJob.entity";
import FfmpegWorkerService from "../FfmpegWorker/FfmpegWorker.service";
import { MovieDbJob } from "../MovieDbJob/MovieDbJob.entity";
import MovieDbJobService from "../MovieDbJob/MovieDbJob.service";
import { TvShowDTO } from "../TvShow/TvShow.dto";
import TvShowService from "../TvShow/TvShow.service";
import { VideoDTO } from "../Video/Video.dto";
import { Video, VideoTypeEnum } from "../Video/Video.entity";
import VideoService from "../Video/Video.service";

type Success = {
  message: "done";
};
export default class DiscoverService {
  videoSer: VideoService;
  tvShowSer: TvShowService;
  mvJobSer: MovieDbJobService;
  ffprobeSer: FfmpegWorkerService;
  pathVideos: string;
  pathTvShows: string;
  tempFile: string;
  regVideo: RegExp = regexVideo;
  regTvShow: RegExp = regexTvShow;

  constructor(
    vs: VideoService,
    ts: TvShowService,
    ms: MovieDbJobService,
    ffs: FfmpegWorkerService
  ) {
    this.videoSer = vs;
    this.tvShowSer = ts;
    this.mvJobSer = ms;
    this.ffprobeSer = ffs;
    this.pathVideos =
      process.env.NODE_ENV === "development" ? "videos" : "Videos";
    this.pathTvShows = process.env.NODE_ENV === "development" ? null : "Series";
    this.tempFile = basePath + path.sep + "temp";
  }

  checkAccess(folderPath: string) {
    if (!folderPath) {
      return err(new MissingDataPayloadException("folderPath"));
    }
    const response = accessFolder(folderPath as string);

    return ok(response);
  }

  async findInDirectory(): Promise<
    Result<{ total: number; data: VideoDTO[] }, Error>
  > {
    const result = await go(
      basePath + path.sep + this.pathVideos,
      this.tempFile,
      this.regVideo,
      []
    );

    const [data, error] = await this.addEntries(result);
    if (error) {
      return err(error);
    }

    return ok({ total: data.length, data });
  }

  async addEntries(
    list: path.ParsedPath[]
  ): Promise<Result<VideoDTO[], Error>> {
    const result: VideoDTO[] = [];

    for (const el of list) {
      const isTvShow = el.name.match(regexTvShow);
      let tvShow: TvShowDTO;
      if (isTvShow) {
        const [result, error] = await this.findOrCreateTvShow(el);
        if (error) {
          logger.error(error);
        }
        tvShow = result;
      }

      const [data, error] = await this.addEntry(el, tvShow);
      if (error) {
        logger.error(error);
      }
      result.push(data);
    }

    return ok(result);
  }

  async findOrCreateTvShow(
    el: path.ParsedPath
  ): Promise<Result<TvShowDTO, Error>> {
    const splitDir = el.dir.split(path.sep);
    let name = splitDir.find((_, i, arr) => arr[i - 1] === this.pathVideos);
    if (name.includes("Cosmos")) {
      name = name.split("-")[0].trimEnd();
    }

    let [result, error] = await this.tvShowSer.findByName(name);
    if (error) {
      return err(error);
    }

    if (Object.keys(result).length) {
      return ok(result);
    }

    const i = splitDir.findIndex(el => el === this.pathVideos);
    const pathDir = splitDir.slice(0, i + 2).join("/");

    [result, error] = await this.tvShowSer.create({
      name,
      location: pathDir,
    });
    if (error) {
      return err(error);
    }

    const [movieJob, error2] = await this.mvJobSer.create(
      result,
      VideoTypeEnum.TV
    );

    return ok(result);
  }

  async addEntry(
    el: path.ParsedPath,
    tvShow: TvShowDTO | undefined
  ): Promise<Result<VideoDTO, Error>> {
    const isTvShow = el.name.match(regexTvShow);
    const [result, error] = await this.videoSer.findAll(0, 0, null, {
      name: el.name,
    });
    if (error) {
      return err(error);
    }
    if (result.data.length) {
      return ok(result.data[0]);
    }

    let name = "",
      season = "",
      episode = "";

    if (isTvShow) {
      const splitDir = el.dir.split(path.sep);
      name = parseBasename(
        splitDir.find((_, i, arr) => arr[i - 1] === this.pathVideos)
      );
      season = isTvShow && (isTvShow[1] || isTvShow[3] || isTvShow[5]);
      episode = isTvShow && (isTvShow[2] || isTvShow[4] || isTvShow[6]);
      name = `${name} s${season}e${episode}`;
    } else {
      const match = el.name.match(regExBasename)[1];
      name = parseBasename(match);
    }

    const year = el.name.match(regexYearDate);
    const pathname = el.dir + path.sep + el.name + el.ext;
    const [ffProbeData] = await this.ffprobeSer.getInfoVideoWithPathname(
      pathname
    );
    const [data, error2] = await this.videoSer.create({
      name: name,
      basename: name,
      filename: el.name,
      location: el.dir,
      ext: el.ext,
      tvShow: tvShow || null,
      type: isTvShow ? VideoTypeEnum.TV : VideoTypeEnum.MOVIE,
      season: +season || null,
      episode: +episode || null,
      year: year?.length ? new Date(year[0]) : null,
      length: +ffProbeData.format.duration.toFixed(2),
    });
    if (error2) {
      return err(error2);
    }

    if (!isTvShow) {
      const [movieJob] = await this.mvJobSer.create(data, VideoTypeEnum.MOVIE);
    }

    return ok(data);
  }

  /**
   * We need to do 2 calls: Movies and Tvshows, we have distinction in movieJob
   * For Movies:
   * first we call on multi -> [0]
   *    we get id, overview, poster_path, release_date, vote_average, poster_path
   * then we call on  `https://api.themoviedb.org/3/movie/${movieId}${apiKey}`
   *    we get genres...
   * then we call on `https://api.themoviedb.org/3/movie/${movieId}/videos${apiKey}
   *    we get youtube key teaser (5 first)
   *
   * For TvShows:
   * first we call on multi -> [0]
   *    we get id, overview, poster_path, first_air_date, vote_average, origin_country
   * then we call on `https://api.themoviedb.org/3/tv/${movieId}${apiKey}`
   *    we get genres, number_of_episodes, number_of_seasons, in_production
   * then we call on `https://api.themoviedb.org/3/tv/${movieId}/videos${apiKey}`
   *
   */
  async getDetailsFromExternalApi(): Promise<Result<Success, Error>> {
    const [movieJobs, error] = await this.mvJobSer.find(0, 0, {
      status: ["todo", "error"],
      type: "movie",
    });

    if (error) {
      logger.error(error);
      return err(error);
    }

    for (const job of movieJobs.data) {
      const year = job.video?.year
        ? new Date(job.video.year).getFullYear()
        : null;

      const [response, error] = await promisifier<any>(
        fetch(movieDbUrl + job.video.basename)
      );
      if (error) {
        logger.error(error);
        continue;
      }

      const { results } = await response.json();
      if (!results.length) {
        logger.error(`No result for ${job.video.basename}`);
        const errorData = {
          status: jobStatusType.ERROR,
          errors: `{${"no result"}}`,
        };
        this.mvJobSer.patch(
          job.id.toString(),
          errorData as unknown as MovieDbJob
        );
        continue;
      }

      let result: any;
      if (year) {
        for (const el of results) {
          const yearEl = new Date(el.release_date).getFullYear();

          if (year === yearEl) {
            result = el;
            break;
          }
        }
      }

      if (!year || !result) {
        result = results[0];
      }

      const genres = await getGenres(result.id);
      const trailerYtCode = await getVideoPath(result.id, "movie");
      const posterPath = job.video.posterPath || [];

      if (result?.poster_path) {
        const exists = posterPath.filter(el => el === result.poster_path);
        if (!exists.length) {
          getImages(result.poster_path);
          posterPath.push(result.poster_path);
        }
      }

      const data = {
        idMovieDb: result.id,
        resume: result.overview,
        releaseDate: result.release_date,
        score: result.vote_average,
        genres: `{${genres.join(",")}}`,
        trailerYtCode: `{${trailerYtCode.join(",")}}`,
        posterPath: `{${posterPath.join(",")}}`,
      };
      const [_, errorPatch] = await this.videoSer.patch(
        job.video.id.toString(),
        data as unknown as Partial<Video>
      );
      let status = jobStatusType.DONE;
      if (errorPatch) {
        status = jobStatusType.ERROR;
      }
      this.mvJobSer.patch(job.id.toString(), {
        status,
      });
    }

    const [tvShowJobs, errorTv] = await this.mvJobSer.find(0, 0, {
      status: ["todo", "error"],
      type: "tv",
    });

    if (errorTv) {
      logger.error(error);
      return err(error);
    }

    for (const job of tvShowJobs.data) {
      const [response, error] = await promisifier<any>(
        fetch(movieDbUrl + job.tvShow.name)
      );

      if (error) {
        logger.error(error);
        continue;
      }

      const { results } = await response.json();

      if (!results.length) {
        logger.error(`No result for ${job.tvShow.name}`);
        const errorData = {
          status: jobStatusType.ERROR,
          errors: `{${"no result"}}`,
        };
        this.mvJobSer.patch(
          job.id.toString(),
          errorData as unknown as MovieDbJob
        );
        continue;
      }

      const result: any = results[0];
      const {
        genres,
        ongoing,
        originCountry = [],
        numberEpisode = null,
        numberSeason = null,
      } = await getTvShowDetails(result.id);
      const trailerYtCode = await getVideoPath(result.id, "tv");
      const posterPath = job.tvShow.posterPath || [];

      if (result?.poster_path) {
        const exists = posterPath.filter(el => el === result.poster_path);
        if (!exists.length) {
          getImages(result.poster_path);
          posterPath.push(result.poster_path);
        }
      }

      const data = {
        idMovieDb: result.id,
        resume: result.overview,
        score: result.vote_average,
        firstAirDate: result.first_air_date,
        ongoing,
        numberEpisode,
        numberSeason,
        originCountry: `{${originCountry.join(",")}}`,
        trailerYtCode: `{${trailerYtCode.join(",")}}`,
        genres: `{${genres.join(",")}}`,
        posterPath: `{${posterPath.join(",")}}`,
      };
      const [_, errorPatch] = await this.tvShowSer.patch(
        job.tvShow.id.toString(),
        data as unknown as MovieDbJob
      );
      let status = jobStatusType.DONE;
      if (errorPatch) {
        status = jobStatusType.ERROR;
      }
      this.mvJobSer.patch(job.id.toString(), { status });
    }

    return ok({ message: "done" });
  }
}
