import { defaultLimit } from "../../config/defaultConfig";
import { Request, Response, NextFunction } from 'express';
import { Controller, Middleware, ErrorMiddleware, Get, Post, Put, Patch, Delete, ClassErrorMiddleware } from "@overnightjs/core"
import errorHandler from "../../services/errorHandler";
import WatchedService from "./Watched.service";
import { regexIsSubtitle } from "../../utils/regexes";

@Controller("")
@ClassErrorMiddleware(errorHandler)
export default class {
  @Get()
  private async find(req: Request, res: Response, next: NextFunction): Promise<void> {

  }
  @Get(":id")
  private async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
  }
  @Post()
  private async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const body = req.body;

    if (!body.videoId) {
      res.json("Missing video ID")
    }

    const watched = await WatchedService.create({
      timeWatched: body.timeWatched,
      length: body.length,
      finished: body.finished,
      video: body.videoId,
      user: body.user
    })

    let tvShow;

    if (body.tvShowId) {
      const exists = await WatchedService.findTvShow(body.tvShowId)

      if (!exists) {
        tvShow = await WatchedService.createTvShow({
          tvShow: body.tvShowId,
          user: body.user,
          videos: [watched]
        })
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
    const { id, isTvShow } = req.body;

    if (!id) {
      res.json("Missing id")
      return;
    }

    let data;

    if (isTvShow) {
      data = await WatchedService.findTvShow(id)
    } else {
      data = await WatchedService.findByVideoId(id)
    }

    if (!data) {
      res.json("Cannot find")
    }

    res.json(data)
    return;
  }

  @Patch(":id")
  private async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
  }

  @Delete(":id")
  private async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
  }

  // TODO: middleware to check if admin
  @Delete()
  private async deleteAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  }
}