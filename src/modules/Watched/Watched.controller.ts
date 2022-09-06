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
import { defaultLimit } from "../../config/defaultConfig";

@Controller("watched")
@ClassErrorMiddleware(errorHandler)
export default class WatchedController {
  constructor(private service: WatchedService) {}

  @Get()
  private async find(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { limit = defaultLimit, skip = 0 } = req.query;
    const [result, error] = await this.service.findAll(+limit, +skip, {
      id: 15,
    });
    if (error) {
      next(error);
    }

    res.json({
      total: result.total,
      skip: +limit + +skip,
      limit: limit,
      data: result?.data ? result.data.map(el => el.serialize()) : [],
    });
  }

  @Get(":id")
  private async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {}

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

    res.json(result);
    return;
  }

  @Patch(":id")
  private async patch(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    const [result, error] = await this.service.update(id, req.body);
    if (error) {
      next(error);
    }

    res.json(result);
  }

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
  ): Promise<void> {}
}
