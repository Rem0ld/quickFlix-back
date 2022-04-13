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
  }

  @Post("change-audio")
  async changeAudio(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.body;

    if (!id) {
      res.json("Missing ID")
      return;
    }

  }
}
