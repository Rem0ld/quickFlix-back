import { defaultLimit } from "../../config/defaultConfig";
import { Request, Response, NextFunction } from "express";
import {
  Controller,
  Middleware,
  ErrorMiddleware,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  ClassErrorMiddleware,
} from "@overnightjs/core";
import errorHandler from "../../services/errorHandler";
import { logger } from "../../libs/logger";
import TvShowService from "./TvShow.service";

@Controller("tv-show")
@ClassErrorMiddleware(errorHandler)
export default class TvShowController {
  constructor(private service: TvShowService) { }

  @Get()
  private async find(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { limit = defaultLimit, skip = 0, populate = false } = req.query;

    // if (+limit === -1) {
    //   const data =

    //   res.json(data)
    //   return;
    // }

    const [result, error] = await this.service.findAll(
      +limit,
      +skip,
    );
    if (error) {
      next(error)
    }

    res.json({
      total: result.total,
      limit,
      skip,
      data: result.data,
    });
    return;
  }

  @Get(":id")
  private async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    try {
      const tvShow = await this.service.findById(id);
      res.json(tvShow);
    } catch (error) {
      next(error)
    } finally {
      return;
    }
  }

  // @Post("by-name")
  // private async findByName(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const { name } = req.body;

  //   const tvShow = await TvShowService.findByName(name);

  //   res.json(tvShow);
  // }

  @Post()
  private async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> { }

  // @Patch(":id")
  // private async patch(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const { id } = req.params;

  //   try {
  //     const response = 

  //     res.json(response);
  //   } catch (error) {
  //     logger.error(error);
  //   } finally {
  //     return;
  //   }
  // }

  @Delete(":id")
  private async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> { }

  // TODO: middleware to check if admin
  // @Delete()
  // private async deleteAll(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const tvShow = await tvShowModel.deleteMany();
  //   const movieJob = await movieDbJobModel.deleteMany({
  //     type: "tv",
  //   });

  //   res.json({
  //     tvShow: tvShow.deletedCount,
  //     movieJob: movieJob.deletedCount,
  //   });
  // }
}
