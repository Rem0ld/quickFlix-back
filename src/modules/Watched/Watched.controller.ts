import { defaultLimit } from "../../config/defaultConfig";
import { Request, Response, NextFunction } from 'express';
import { Controller, Middleware, ErrorMiddleware, Get, Post, Put, Patch, Delete, ClassErrorMiddleware } from "@overnightjs/core"
import errorHandler from "../../services/errorHandler";
import { regexIsSubtitle } from "../../utils/regexes";
import WatchedService from "./Watched.service";
import WatchedTvShowService from "../WatchedTvShow/WatchedTvShow.service";
import { watchedModel } from "../../schemas/Watched";
import { watchedTvShowModel } from "../../schemas/WatchedTvShow";

@Controller("watched")
@ClassErrorMiddleware(errorHandler)
export default class WatchedController {
  @Get()
  private async find(req: Request, res: Response, next: NextFunction): Promise<void> {
    const data = await watchedModel.find()

    res.json(data)
    return;
  }
  @Get(":id")
  private async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params
    const data = await watchedModel.findById(id)

    res.json(data)
    return;
  }

  @Post()
  private async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const body = req.body;

    if (!body.videoId) {
      res.json("Missing video ID")
      return;
    }

    const watched = await WatchedService.create({
      timeWatched: body.timeWatched,
      length: body.length,
      finished: body.finished,
      video: body.videoId
    })

    let tvShow;

    if (body.tvShowId) {
      const exists = await WatchedTvShowService.findTvShow(body.tvShowId)

      if (!exists) {
        tvShow = await WatchedTvShowService.update(body.tvShowId, { _id: body.videoId })
      }
    }

    res.json({
      video: watched,
      tvShow: tvShow ? tvShow : null
    })
    return
  }

  @Post("by-video")
  private async findByVideoId(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.body;

    if (!id) {
      res.json("Missing id")
      return;
    }

    const data = await WatchedService.findByVideoId(id)

    if (!data) {
      res.json("Doesn't find")
      return;
    }

    res.json(data)
    return;
  }

  @Patch()
  private async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id, ...rest } = req.body;

    if (!id) {
      res.json("missing Id")
      return;
    }

    try {
      const data = await WatchedService.update(id, rest)

      res.json(data)
    } catch (error) {
      next(error)
    }
    return;
  }

  @Delete(":id")
  private async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params

    if (!id) {
      res.json("Missing ID")
      return;
    }

    const data = await watchedModel.findByIdAndDelete(id)

    res.json(data)
    return;
  }

  // TODO: middleware to check if admin
  @Delete()
  private async deleteAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const data = await watchedModel.deleteMany()
    const result = await watchedTvShowModel.deleteMany()

    res.json({
      watched: data.deletedCount,
      watchedTvShow: result.deletedCount
    })
    return;
  }
}