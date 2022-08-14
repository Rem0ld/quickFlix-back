import path from "path";
import { basePath } from "../../config/defaultConfig";
import { logger } from "../../libs/logger";
import { err, ok } from "../../services/Error";
import { go } from "../../services/miscelleneaous";
import { Result } from "../../types";
import {
  regExBasename,
  regexTvShow,
  regexVideo,
  regexYearDate,
} from "../../utils/regexes";
import { parseBasename } from "../../utils/stringManipulation";
import MovieDbJobService from "../MovieDbJob/MovieDbJob.service";
import { TvShowDTO } from "../TvShow/TvShow.dto";
import TvShowService from "../TvShow/TvShow.service";
import { VideoDTO } from "../Video/Video.dto";
import { VideoTypeEnum } from "../Video/Video.entity";
import VideoService from "../Video/Video.service";

export default class DiscoverService {
  videoSer: VideoService;
  tvShowSer: TvShowService;
  mvJobSer: MovieDbJobService;
  pathVideos: string;
  pathTvShows: string;
  tempFile: string;
  regVideo: RegExp = regexVideo;
  regTvShow: RegExp = regexTvShow;
  constructor(vs: VideoService, ts: TvShowService, ms: MovieDbJobService) {
    this.videoSer = vs;
    this.tvShowSer = ts;
    this.mvJobSer = ms;
    this.pathVideos =
      process.env.NODE_ENV === "development" ? "videos" : "Videos";
    this.pathTvShows = process.env.NODE_ENV === "development" ? null : "Series";
    this.tempFile = basePath + path.sep + "temp";
  }

  async findInDirectory() {
    const result = await go(
      basePath + path.sep + this.pathVideos,
      this.tempFile,
      this.regVideo,
      []
    );

    const [data, error] = await this.addEntries(result);
    if (error) {
      err(error);
    }

    return { total: data.length, data };
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
    const name = splitDir.find((_, i, arr) => arr[i - 1] === this.pathVideos);

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

    const [movieJob, error2] = await this.mvJobSer.create(result.id, VideoTypeEnum.TV)

    return ok(result);
  }

  async addEntry(
    el: path.ParsedPath,
    tvShow: TvShowDTO | undefined
  ): Promise<Result<VideoDTO, Error>> {
    const isTvShow = el.name.match(regexTvShow);
    const [result, error] = await this.videoSer.findByFields({ name: el.name });
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

    const year = el.name.match(regexYearDate)
    const [data, error2] = await this.videoSer.create({
      name: name,
      basename: name,
      filename: el.name,
      location: el.dir,
      ext: el.ext,
      tvShow: tvShow,
      type: isTvShow ? VideoTypeEnum.TV : VideoTypeEnum.MOVIE,
      season: +season || null,
      episode: +episode || null,
      year: year?.length ? new Date(year[0]) : null
    });
    if (error2) {
      return err(error2);
    }
    const [movieJob] = await this.mvJobSer.create(data.id, VideoTypeEnum.MOVIE)

    return ok(data);
  }
}
