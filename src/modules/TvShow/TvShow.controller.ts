import { defaultLimit } from "../../config/defaultConfig";
import { Request, Response, NextFunction } from 'express';
import { Controller, Middleware, ErrorMiddleware, Get, Post, Put, Patch, Delete, ClassErrorMiddleware } from "@overnightjs/core"
import errorHandler from "../../services/errorHandler";
import { tvShowModel } from "../../schemas/TvShow";
import TvShowService from "./TvShow.service";
import { TvShow } from "../../types";
import { movieDbJobModel } from "../../schemas/MovieDbJob";
import { logger } from "../../libs/logger";

@Controller("tv-show")
@ClassErrorMiddleware(errorHandler)
export default class TvShowController {
  @Get()
  private async find(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { limit = defaultLimit, skip = 0, populate = false } = req.query;

    if (+limit === -1) {
      const data = await TvShowService.findAll(populate as boolean)

      res.json(data)
      return;
    }

    const { data, count } = await TvShowService.find({
      limit: +limit,
      skip: +skip,
      populate: populate as boolean
    })

    res.json({
      total: count,
      limit: +limit,
      skip: +skip,
      data,
    });
    return;
  }

  @Get(":id")
  private async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;

    if (!id) {
      next(new Error("Missing id"))
      return;
    }

    const tvShow = await tvShowModel.findById(id);

    if (!tvShow) {
      next(new Error("TvShow doesnt exists"));
      return;
    }

    res.json(tvShow);
    return;
  }

  @Post("by-name")
  private async findByName(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name } = req.body;

    if (!name) {
      next(new Error("missing name"))
      return;
    };

    const tvShow = await TvShowService.findByName(name);

    if (!tvShow) {
      next(new Error("TvShow doesn't exists"));
      return;
    }

    res.json(tvShow);
  }


  @Post()
  private async create(req: Request, res: Response, next: NextFunction): Promise<void> {
  }

  @Patch(":id")
  private async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params

    if (!id) {
      res.json("Missing argument")
      return;
    }

    try {
      const response = await tvShowModel.findByIdAndUpdate(id, req.body)

      res.json(response)
    } catch (error) {
      logger.error(error)
    } finally {
      return;
    }
  }

  @Delete(":id")
  private async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
  }
  // TODO: middleware to check if admin
  @Delete()
  private async deleteAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const tvShow = await tvShowModel.deleteMany();
    const movieJob = await movieDbJobModel.deleteMany({
      type: "tv"
    })

    res.json({
      tvShow: tvShow.deletedCount,
      movieJob: movieJob.deletedCount
    })
  }
}