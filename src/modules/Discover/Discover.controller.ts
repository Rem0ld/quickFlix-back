import path from "path";
import { rm } from "fs/promises";
import fetch from "node-fetch";
import { Request, Response, NextFunction } from "express";
import {
  Controller,
  Get,
  ClassErrorMiddleware,
} from "@overnightjs/core";
import { basePath, movieDbUrl } from "../../config/defaultConfig";
import errorHandler from "../../services/errorHandler";
import { regexIsSubtitle, regexVideo } from "../../utils/regexes";
import { videoModel } from "../../schemas/Video";
import { movieJobService } from "../MovieDbJob/MovieDbJob.service";
import TvShowService from "../TvShow/TvShow.service";
import { MovieJobStatus, TvShow, Video } from "../../types";
import { go, createEntry } from "../../services/miscelleneaous";
import {
  getImages,
  getGenres,
  getVideoPath,
  getTvShowDetails,
} from "../../services/apiService";
import { appendFile, existsSync } from "fs";
import ffmpeg, { FfmpegCommand, FfprobeStream } from "fluent-ffmpeg";
import { encodingJobModel } from "../../schemas/EncodingJobs";
import { spawn } from "child_process";
import { logger } from "../../libs/logger";

@Controller("discover")
@ClassErrorMiddleware(errorHandler)
export default class DiscoverController {
  @Get("")
  private async discover(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const videosPath = basePath + path.sep + "videos";
    const tempFile = basePath + path.sep + "video";

    /**
     * Should work like this but if video exists it will not be added in TVShow
     * TODO: Create a job just to create tvshows
     */
    await go(videosPath, "video", regexVideo);
    // await go(p, "subtitle", regexIsSubtitle);

    const result = await createEntry(tempFile, "video", "videos");
    await rm(tempFile);
    res.json(result);
  }

  // @Get("subtitles")
  // private async subtitles(req: Request, res: Response, next: NextFunction): Promise<void> {

  //   let countSubtitleCreated = 0;
  //   const subDirectories = [];
  //   const files = await findFiles(basePath);

  //   const goThrough = async (files, extraPath = "") => {
  //     for (const file of files) {
  //       const ext = path.extname(file.name);
  //       const isSubtitle = regexIsSubtitle.test(ext);

  //       const exclude = excludedExtension.some(ext => file.name.includes(ext));

  //       if (exclude) continue;

  //       if (file.isDirectory() || file.isSymbolicLink()) {
  //         const sub = await findFiles(basePath + "/" + extraPath + "/" + file.name);
  //         subDirectories.push({
  //           directory: extraPath + "/" + file.name,
  //           content: sub.filter(el => !el.name.includes("DS_Store")),
  //         });
  //         continue;
  //       }

  //       // Here we need to work the file
  //       const filename = path.basename(file.name, ext);
  //       const absolutePath = path.resolve(basePath + "/" + extraPath + "/");
  //       let basename = filename.match(regExBasename);

  //       basename = parseBasename(basename[1]);

  //       const isTvShow = filename.match(regexTvShow);
  //       const season = isTvShow && (isTvShow[1] || isTvShow[3]);
  //       const episode = isTvShow && (isTvShow[2] || isTvShow[4]);

  //       if (isSubtitle) {
  //         const subExists = await subtitleModel.find({ name: filename });
  //         if (subExists.length > 0) continue;

  //         if (ext.includes("srt")) {
  //           createReadStream(absolutePath + "/" + file.name)
  //             .pipe(srt2vtt())
  //             .pipe(createWriteStream(`${absolutePath}/${filename}.vtt`));
  //         }

  //         const data = await subtitleModel.create({
  //           ext: ".vtt",
  //           path: absolutePath,
  //           name: filename,
  //         });

  //         let video;

  //         if (isTvShow) {
  //           video = await VideoService.findByFields({
  //             name: basename,
  //             episode: +episode,
  //             season: +season,
  //           });
  //         } else {
  //           video = await VideoService.findByFields({
  //             name: basename,
  //           });

  //           if (video.length) {
  //             video[0].subtitles.push(data._id);
  //             await video[0].save();
  //           }
  //         }

  //         countSubtitleCreated++;
  //         continue;
  //       } else {
  //         // It's a video let's look into container for text streams

  //         const result = await findSubtitles(
  //           absolutePath + "/" + file.name,
  //           basename,
  //           isTvShow,
  //           season,
  //           episode
  //         );
  //         // console.log(result);
  //       }
  //     }

  //     while (subDirectories.length > 0) {
  //       const subDirectory = subDirectories.shift();
  //       await goThrough(subDirectory.content, subDirectory.directory);
  //     }
  //   };
  //   await goThrough(files);

  //   res.json({
  //     countSubtitleCreated,
  //   });
  // }

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
  @Get("details")
  private async details(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    let count = 0,
      errorCount = 0;

    // Movies
    const movieJobs = await movieJobService.findActive({ type: "movie" });

    if (movieJobs?.length) {
      for (const job of movieJobs) {
        const video: Video = await videoModel.findById(job.video) as Video;
        const yearMovie = new Date(video.year).getFullYear();
        let status: MovieJobStatus = "done";

        // API Call
        const response = await fetch(movieDbUrl + video.basename);
        const { results } = await response.json();

        if (!results || !results.length) {
          logger.error(`No result for ${video.basename}`);
          continue;
        }

        let result;

        // In case of several movies with the same name we look for the release date
        // not bullet proof but will do the job
        if (yearMovie) {
          for (const el of results) {
            const yearResult = new Date(el.release_date).getFullYear();

            if (yearMovie === yearResult) {
              result = el;
              break;
            }
          }
        }

        // In the case dates are not correct
        // See Bac Nord - 2020 on file, 2021 on themoviedb
        if (!yearMovie || !result) {
          result = results[0];
        }

        // Making the new video object
        video.idMovieDb = result.id;
        video.resume = result.overview;
        video.releaseDate = result.release_date;
        video.score = result.vote_average;

        try {
          video.genres = await getGenres(result.id);
          video.trailerYtCode = await getVideoPath(result.id, "movie");

          if (result?.poster_path) {
            // Getting image if doesn't exists
            getImages(result?.poster_path);

            // Checking if document already have this image on BDD
            if (!video.posterPath.length || video.posterPath[0] !== result.poster_path) {
              video.posterPath.push(result.poster_path);
            }
          }
          // // @ts-ignore
          // await video.save();
        } catch (error) {
          console.log(error)
        }


        try {
          // @ts-ignore
          await video.save();
          await movieJobService.update(job._id, { status, error: job.error });

        } catch (error) {
          console.error("not saved", error);
          status = "error";
          job.error.push(error as string);
          await movieJobService.update(job._id, { status, error: job.error });
          errorCount++;
        } finally {
          await new Promise(r => setTimeout(r, 2000));
          count++;
        }
      }
    }

    // TvShows
    const tvJobs = await movieJobService.findActive({ type: "tv" });

    if (tvJobs) {
      for (const job of tvJobs) {
        const tvShow = await TvShowService.findByName(
          job.video.basename
        ) as TvShow;
        let status: MovieJobStatus = "done";

        const response = await fetch(movieDbUrl + tvShow.name);
        const { results } = await response.json();

        if (!results.length) {
          console.error(`No result for ${tvShow}`);
          continue;
        }

        let result = results[0];

        if (result.poster_path) {
          getImages(result.poster_path);

          if (!tvShow.posterPath.length || tvShow.posterPath[0] !== result.poster_path) {
            tvShow.posterPath.push(result.poster_path);
          }
        }

        tvShow.idMovieDb = result.id;
        tvShow.resume = result.overview;
        tvShow.score = result.vote_average;
        tvShow.firstAirDate = result.first_air_date;
        tvShow.trailerYtCode = await getVideoPath(result.id, "tv");

        const { genres, ongoing, originCountry, numberEpisode, numberSeason } =
          await getTvShowDetails(result.id);

        tvShow.genres = genres || [];
        tvShow.ongoing = ongoing || undefined;
        tvShow.originCountry = originCountry || [];
        tvShow.numberSeason = numberSeason || undefined;
        tvShow.numberEpisode = numberEpisode || undefined;

        try {
          // @ts-ignore
          await tvShow.save();
        } catch (error) {
          console.error("not saved", error);
          status = "error";
          job.error.push(error as string);
          errorCount++;
        }

        movieJobService.update(job._id, { status, error: job.error });
        count++;
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    res.json({
      errorCount,
      count,
    });
  }

  @Get("audio")
  private async audio(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const proprietaryCodec = ["ac3", "eac3"];
    let promises = [];

    try {
      const videos: Video[] = await videoModel.find();

      for (const video of videos) {
        const { _id: videoId, location, filename } = video;
        const pathname = `${location}/${filename}`;

        /**
         * Making promise because ffprobe is a false synchrone operation
         * as it checks codecs of a file (working with file is almost always asynchrone)
         */
        const promise = new Promise((resolve, reject) => {
          ffmpeg(pathname)
            .input(pathname)
            .ffprobe(async (err, data) => {
              if (err) {
                reject({ videoId, err });
              }

              /**
               * data: Ojbect {
               *  streams: Array [
               *  codec_name: string (ac3)
               *  codec_long_name: string
               *  codec_type: string (audio)
               * ]
               * }
               */
              const { streams }: { streams: Array<any> } = data;
              let result;

              for (const stream of streams) {
                const { codec_name } = stream;

                if (proprietaryCodec.includes(codec_name)) {
                  result = {
                    videoId: videoId.toString(),
                    pathname,
                    status: "todo",
                    error: [`wrong format ${codec_name}`],
                    type: "audio",
                  };
                  resolve(result);
                }
              }
              resolve(null)

            });
        });

        promises.push(promise);
      }

      /**
       * Resolving all promises at once to go fast
       * filtering result to remove null values
       * then trying to upsert jobs
       * finally returning result
       */
      let result = await Promise.allSettled(promises);

      promises = [];
      promises = result.filter((el: any) => el.value !== null).map(async (el: any) => {
        const { value } = el;
        appendFile('./jobs/encodingJobs', `${value.pathname}\n`, () => { });
        return encodingJobModel.findByIdAndUpdate(value.videoId, value, {
          upsert: true,
        });
      });

      let created = await Promise.allSettled(promises);
      created = created.filter((el: any) => el.value !== null);

      res.json({ total: created.length, data: created, result: created.map((el: any) => el.value.pathname) });
    } catch (error: any) {
      res.json({
        message: error.message,
        path: error.path,
        code: error.code,
      });
    }
  }
}
