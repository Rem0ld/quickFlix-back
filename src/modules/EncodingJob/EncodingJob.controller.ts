import { defaultLimit } from "../../config/defaultConfig";
import { Request, Response, NextFunction } from "express";
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  ClassErrorMiddleware,
} from "@overnightjs/core";
import errorHandler from "../../services/errorHandler";

@Controller("encoding-job")
@ClassErrorMiddleware(errorHandler)
export default class EncodingJobController {
  @Get()
  async find(req: Request, res: Response, next: NextFunction): Promise<void> {}

  // TODO: middleware to check if admin
  @Delete()
  private async deleteAll(
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {}

  @Post("audio")
  async audioJobs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {}

  @Post("change-audio")
  async changeAudio(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {}
}
