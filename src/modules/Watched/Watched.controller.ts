import { Request, Response, NextFunction } from "express";
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  ClassErrorMiddleware,
} from "@overnightjs/core";
import errorHandler from "../../services/errorHandler";
import WatchedService from "./Watched.service";
import WatchedTvShowService from "../WatchedTvShow/WatchedTvShow.service";
import { logger } from "../../libs/logger";

@Controller("watched")
@ClassErrorMiddleware(errorHandler)
export default class WatchedController {
  constructor(private service: WatchedService) { }

  @Get()
  private async find(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
  }

  @Get(":id")
  private async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
  }

  @Post()
  private async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
  }

  @Post("by-video")
  private async findByVideoId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
  }

  @Patch(":id")
  private async patch(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
  }

  @Delete(":id")
  private async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
  }

  // TODO: middleware to check if admin
  @Delete()
  private async deleteAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
  }
}
