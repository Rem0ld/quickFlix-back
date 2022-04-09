import { defaultLimit } from "../../config/defaultConfig";
import { Request, Response, NextFunction } from 'express';
import { Controller, Middleware, ErrorMiddleware, Get, Post, Put, Delete, ClassErrorMiddleware, Patch } from "@overnightjs/core"
import errorHandler from "../../services/errorHandler";
import { EncodingJob, Pagination } from "../../types";
import { encodingJobModel } from "../../schemas/EncodingJobs";
import { encodingJobService } from "./EncodingJob.service";
import ffmpeg, { FfmpegCommand, FfprobeStream } from "fluent-ffmpeg";
import path from "path";

@Controller("encoding-job")
@ClassErrorMiddleware(errorHandler)
export default class EncodingJobController {
  @Get()
  async find(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { limit = defaultLimit, skip = 0, populate = false } = req.query;

    if (+limit === -1) {
      const data = await encodingJobModel.find();
      res.json(data);
      return;
    }

    try {
      const count = await encodingJobModel.countDocuments();
      const data = await encodingJobService.find({
        limit: +limit,
        skip: +skip,
        populate: populate as boolean,
      });

      res.json({
        total: count,
        limit: +limit,
        skip: +skip,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // TODO: middleware to check if admin
  @Delete()
  private async deleteAll(_: Request, res: Response, next: NextFunction): Promise<void> {
    const jobs = await encodingJobModel.deleteMany();

    res.json(`${jobs.deletedCount} removed`);
  }

  @Post("audio")
  async audioJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { limit = defaultLimit, skip = 0 } = req.query;
    const jobs = await encodingJobService.findByType({ limit, skip, type: "audio" })
    console.log("🚀 ~ file: EncodingJob.controller.ts ~ line 54 ~ EncodingJobController ~ audioJobs ~ jobs", jobs)

    let result: any = [], i = 0, activeJob = 0

    const wrapper = (job: EncodingJob) => {
      const base = path.dirname(job.pathname)
      const ext = path.extname(job.pathname)

      return ffmpeg(job.pathname)
        .audioCodec('libmp3lame')
        .audioQuality(2)
        .on('start', (commandLine) => {
          console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('progress', function (progress) {
          console.log('Processing: ' + progress.percent + '% done');
        })
        .on("end", (stdout) => {
          console.log("🚀 ~ file: EncodingJob.controller.ts ~ line 74 ~ EncodingJobController ~ .on ~ stdout", stdout)
          i++

          result.push(job);

          job.status = "done"
          // @ts-ignore
          job.save()
          console.log("process finished")
          res.json(result)
        })
        .on("error", (err) => {
          console.log("🚀 ~ file: EncodingJob.controller.ts ~ line 82 ~ EncodingJobController ~ .on ~ err", err)
        })
        .save(`${base}/temp${ext}`);
    }


    if (!jobs) {
      res.json("no more audio jobs")
    }

    // res.json(jobs)
    wrapper(jobs[i])

    // try {


    // } catch (error) {
    //   console.log(error)
    // } finally {
    //   res.json(result)
    // }
  }

  // @Post("vidoe")
  // async videoJobs(req: Request, res: Response, next: NextFunction): Promise<void> {

  // }

  // @Get(":id")
  // async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   const { id } = req.params;

  //   if (!id) next(new Error("Requires an id"));

  //   const data = movieJobService.findById(id);

  //   res.json(data);
  // }


  // @Patch(:id)
  // async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   const { type } = req.body;

  //   console.log(type);

  //   if (type === "reset") {
  //     await movieDbJobModel.updateMany(
  //       { status: "done" },
  //       {
  //         status: "todo",
  //       }
  //     );
  //   }

  //   res.json("ok");
  // }
}
