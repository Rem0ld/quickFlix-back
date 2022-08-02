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
import { promisifier } from "../../services/promisifier";

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

    const [result, error] = await this.service.findAll(+limit, +skip);
    if (error) {
      next(error);
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

    const [result, error] = await promisifier(this.service.findById(id));
    if (error) {
      next(error);
    }
    res.json(result);
  }

  @Post("by-name")
  private async findByName(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { name } = req.body;
    console.log(
      "🚀 ~ file: TvShow.controller.ts ~ line 75 ~ TvShowController ~ name",
      name
    );

    const [result, error] = await promisifier(this.service.findByName(name));
    if (error) {
      next(error);
    }

    res.json(result);
  }

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
  @Delete()
  private async deleteAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const [result, error] = await promisifier<void>(this.service.deleteAll())
    if (error) {
      next(error)
    }

    res.json(result)
  }
}
