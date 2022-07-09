import { movieDbJobModel } from "../../schemas/MovieDbJob";
import { movieJobService } from "./MovieDbJob.service";
import { defaultLimit } from "../../config/defaultConfig";
import { Request, Response, NextFunction } from 'express';
import { Controller, Middleware, ErrorMiddleware, Get, Post, Put, Delete, ClassErrorMiddleware, Patch } from "@overnightjs/core"
import errorHandler from "../../services/errorHandler";
import { Pagination, TvShow, TVideo } from "../../types";
import VideoService from "../Video/Video.service";
import { videoModel } from "../../schemas/Video";
import TvShowService from "../TvShow/TvShow.service";
import { tvShowModel } from "../../schemas/TvShow";

@Controller("movie-job")
@ClassErrorMiddleware(errorHandler)
export default class MovieDbJobController {
  @Get()
  async find(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { limit = defaultLimit, skip = 0, populate = false } = req.query;

    if (+limit === -1) {
      const data = await movieDbJobModel.find();
      res.json(data);
      return;
    }

    try {
      const count = await movieDbJobModel.countDocuments();
      const data = await movieJobService.find({
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

  @Get(":id")
  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;

    if (!id) next(new Error("Requires an id"));

    const data = movieJobService.findById(id);

    res.json(data);
  }

  @Post()
  async findByVideoId(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.body;

    if (!id) next(new Error("Requires an id"));

    const data = movieJobService.findByVideoId(id);

    res.json(data);
  }

  @Post("make")
  async make(req: Request, res: Response, next: NextFunction): Promise<void> {
    const videos: TVideo[] = await videoModel.find({ type: 'movie' });
    const tvShows: TvShow[] = await tvShowModel.find({});
    const promises: any = []

    try {
      for (const video of videos) {
        if (!video.posterPath.length) {
          promises.push(movieJobService.create({ id: video._id }))
        }
      }

      for (const tvShow of tvShows) {
        if (!tvShow.posterPath.length) {
          promises.push(movieJobService.create({ id: tvShow._id, type: "tv" }))
        }
      }

      Promise.allSettled(promises).then(result => {
        res.json(result)
      })
    } catch (error) {
      res.json(error)
    }

  }

  @Patch()
  async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { type } = req.body;

    if (type === "reset") {
      await movieDbJobModel.updateMany(
        { status: "done" },
        {
          status: "todo",
        }
      );
    }

    res.json("ok");
  }

  @Delete()
  async deleteAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const movieJob = await movieDbJobModel.deleteMany();

    res.json(movieJob.deletedCount + " deleted")
  }
}
