import { ClassErrorMiddleware, Controller, Post } from "@overnightjs/core";
import { NextFunction, Request, Response } from "express";
import errorHandler from "../../services/errorHandler";
import FfmpegWorkerService from "./FfmpegWorker.service";

type Body = {
  uuid: string;
};

@Controller("ffmpeg")
@ClassErrorMiddleware(errorHandler)
export default class FfmpegWorkerController {
  constructor(private service: FfmpegWorkerService) {}

  @Post("ffprobe")
  private async getInfoVideo(
    req: Request<unknown, unknown, Body, unknown>,
    res: Response,
    next: NextFunction
  ) {
    const { uuid } = req.body;
    const [result, error] = await this.service.getInfoVideoWithUuid(uuid);
    if (error) {
      next(error);
      return;
    }
    res.json(result);
    return;
  }
}
