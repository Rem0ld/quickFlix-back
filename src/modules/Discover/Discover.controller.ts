import { Request, Response, NextFunction } from "express";
import { Controller, Get, ClassErrorMiddleware } from "@overnightjs/core";
import errorHandler from "../../services/errorHandler";
import { accessFolder } from "../../utils/fileManipulation";
import DiscoverService from "./Discover.service";

@Controller("discover")
@ClassErrorMiddleware(errorHandler)
export default class DiscoverController {
  constructor(private service: DiscoverService) {}

  @Get("")
  private async discover(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const [result, error] = await this.service.findInDirectory();
    if (error) {
      next(error);
      return;
    }
    res.json(result);
  }

  @Get("details")
  private async details(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const [result, error] = await this.service.getDetailsFromExternalApi();
    if (error) {
      next(error);
      return;
    }

    res.json(result.message);
  }

  // @Get("subtitles")
  // private async subtitles(req: Request, res: Response, next: NextFunction): Promise<void> {

  //   let countSubtitleCreated = 0;
  //   const subDirectories = [];
  //   const files = await findFiles(basePath);

  //   const goThrough = async (files, extraPath = "") => {
  //       const isSubtitle = regexIsSubtitle.test(ext);

  //       if (exclude) continue;

  //         subDirectories.push({
  //           content: sub.filter(el => !el.name.includes("DS_Store")),
  //         });
  //         continue;
  //       }

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

  @Get("drive")
  private async accessDrive(req: Request, res: Response): Promise<void> {
    const folderPath = req.query.folderPath;

    if (!folderPath) {
      res.json("Missing folderPath");
      return;
    }
    console.log(folderPath);
    const response = accessFolder(folderPath as string);

    res.json({ access: response });
  }

  // @Get("audio")
  // private async audio(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const proprietaryCodec = ["ac3", "eac3", "dts"];
  //   let promises = [];

  //   logger.info("starting");
  //   try {
  //     const videos: Video[] = await videoModel.find();

  //     for (const video of videos) {
  //       const { _id: videoId, location, filename } = video;
  //       const pathname = `${location}/${filename}`;

  //       /**
  //        * Making promise because ffprobe is a false synchrone operation
  //        */
  //       const promise = new Promise((resolve, reject) => {
  //         ffmpeg(pathname)
  //           .input(pathname)
  //           .ffprobe(async (err, data) => {
  //             if (err) {
  //               reject({ videoId, err });
  //             }
  //             logger.info(`Processing ${pathname}`);
  //             /**
  //              * data: Ojbect {
  //              *  streams: Array [
  //              *  codec_name: string (ac3)
  //              *  codec_long_name: string
  //              *  codec_type: string (audio)
  //              * ]
  //              * }
  //              */
  //             const { streams }: { streams: Array<any> } = data;
  //             let result;

  //             for (const stream of streams) {
  //               const { codec_name } = stream;

  //               if (proprietaryCodec.includes(codec_name)) {
  //                 result = {
  //                   videoId: videoId.toString(),
  //                   pathname,
  //                   status: "todo",
  //                   error: [`wrong format ${codec_name}`],
  //                   type: "audio",
  //                 };
  //                 resolve(result);
  //               }
  //             }
  //             resolve(null);
  //           });
  //       });

  //       promises.push(promise);
  //     }

  //     /**
  //      * Resolving all promises at once to go fast
  //      * filtering result to remove null values
  //      * then trying to upsert jobs
  //      * finally returning result
  //      */
  //     let result = await Promise.allSettled(promises);

  //     promises = [];
  //     promises = result
  //       .filter((el: any) => el.value !== null)
  //       .map(async (el: any) => {
  //         const { value } = el;
  //         appendFile("./jobs/encodingJobs", `${value.pathname}\n`, () => { });
  //         return encodingJobModel.findByIdAndUpdate(value.videoId, value, {
  //           upsert: true,
  //         });
  //       });

  //     let created = await Promise.allSettled(promises);
  //     created = created.filter((el: any) => el.value !== null);

  //     res.json({
  //       total: created.length,
  //       data: created,
  //       result: created.map((el: any) => el.value.pathname),
  //     });
  //   } catch (error: any) {
  //     res.json({
  //       message: error.message,
  //       path: error.path,
  //       code: error.code,
  //     });
  //   }
  // }
}
