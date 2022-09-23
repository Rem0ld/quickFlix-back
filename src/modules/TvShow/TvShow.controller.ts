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
  constructor(private service: TvShowService) {}

  @Get()
  private async find(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { limit = defaultLimit, skip = 0 } = req.query;

    const [result, error] = await this.service.findAll(+limit, +skip);
    if (error) {
      next(error);
      return;
    }

    res.json({
      total: result.total,
      limit: +limit,
      skip: +skip,
      data: result?.data ? result.data.map(el => el.serialize()) : [],
    });
  }

  @Get(":id")
  private async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    const [result, error] = await this.service.findById(id);
    if (error) {
      next(error);
      return;
    }
    res.json(result.serialize());
  }

  @Post("by-name")
  private async findByName(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { name } = req.body;

    const [result, error] = await this.service.findByName(name);
    if (error) {
      next(error);
      return;
    }

    res.json(result.serialize());
  }

  @Post()
  private async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const [result, error] = await this.service.create(req.body);
    if (error) {
      next(error);
      return;
    }

    res.json({
      result,
    });
  }

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
  ): Promise<void> {}

  // TODO: middleware to check if admin
  @Delete()
  private async deleteAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const [result, error] = await this.service.deleteAll();
    if (error) {
      next(error);
      return;
    }

    res.json(result);
  }
}
