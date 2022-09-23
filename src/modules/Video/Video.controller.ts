import { defaultLimit } from "../../config/defaultConfig";
import { Request, Response, NextFunction } from "express";
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  ClassErrorMiddleware,
  ClassMiddleware,
  Middleware,
} from "@overnightjs/core";
import errorHandler from "../../services/errorHandler";
import VideoService from "./Video.service";
import protectRoutes from "../../middlewares/protectRoutes.middleware";
import verifyAdmin from "../../middlewares/verifyAdmin.middleware";

@Controller("video")
@ClassMiddleware([protectRoutes])
@ClassErrorMiddleware(errorHandler)
export default class VideoController {
  constructor(private service: VideoService) {}

  @Get()
  private async find(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { limit = defaultLimit, skip = 0, user, ...rest } = req.query;

    const [result, error] = await this.service.findAll(
      +limit,
      +skip,
      user as string,
      rest
    );
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

  @Get("uuid/:uuid")
  private async findByUuid(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { uuid } = req.params;
    const { user } = req.query;

    const [result, error] = await this.service.findByUuid(uuid, user as string);
    if (error) {
      next(error);
      return;
    }

    res.json(result.serialize());
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

  @Middleware([verifyAdmin])
  @Patch(":id")
  private async patch(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const [result, error] = await this.service.patch(id, req.body);
    if (error) {
      next(error);
      return;
    }

    res.json(result);
    return;
  }

  @Middleware([verifyAdmin])
  @Delete(":id")
  private async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const [result, error] = await this.service.deleteOneById(id);
    if (error) {
      next(error);
      return;
    }
    res.json(result);
  }

  @Middleware([verifyAdmin])
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
