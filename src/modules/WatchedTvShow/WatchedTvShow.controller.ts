import { defaultLimit } from "../../config/defaultConfig";
import { Request, Response, NextFunction } from 'express';
import { Controller, Middleware, ErrorMiddleware, Get, Post, Put, Patch, Delete, ClassErrorMiddleware } from "@overnightjs/core"
import errorHandler from "../../services/errorHandler";
import { regexIsSubtitle } from "../../utils/regexes";
import WatchedTvShowService from "../WatchedTvShow/WatchedTvShow.service";
import { watchedModel } from "../../schemas/Watched";
import { watchedTvShowModel } from "../../schemas/WatchedTvShow";

@Controller("watched-tv-show")
@ClassErrorMiddleware(errorHandler)
export default class WatchedTvShowController {
  @Get()
  private async find(req: Request, res: Response, next: NextFunction): Promise<void> {
    const data = await watchedTvShowModel.find()

    res.json(data)
    return;
  }

  @Get(":id")
  private async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params
    const data = await watchedTvShowModel.findById(id)

    res.json(data)
    return;
  }

  @Post()
  private async create(req: Request, res: Response, next: NextFunction): Promise<void> {

    return
  }

  @Patch()
  private async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name, videoId } = req.body;

    if (!name) {
      res.json("Missing arguments")
      return;
    }

    const result = await WatchedTvShowService.update(name, { _id: videoId })

    res.json(result)
  }

  @Delete(":id")
  private async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
  }

  // TODO: middleware to check if admin
  @Delete()
  private async deleteAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  }
}