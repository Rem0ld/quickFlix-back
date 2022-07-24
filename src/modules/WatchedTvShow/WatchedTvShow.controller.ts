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
import WatchedTvShowService from "../WatchedTvShow/WatchedTvShow.service";

@Controller("watched-tv-show")
@ClassErrorMiddleware(errorHandler)
export default class WatchedTvShowController {
  constructor(private service: WatchedTvShowService) { }

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

  @Post("by-name")
  private async findByName(
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

  @Patch()
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
  ): Promise<void> { }
}
