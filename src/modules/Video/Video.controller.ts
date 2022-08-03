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
} from "@overnightjs/core";
import errorHandler from "../../services/errorHandler";
import VideoService from "./Video.service";
import { VideoTypeEnum } from "./Video.entity";
import { VideoDTO } from "./Video.dto";
import protectRoutes from "../../middlewares/protectRoutes.middleware";

type query = {
  name?: string;
  episode?: string;
  season?: string;
  type?: VideoTypeEnum[];
  limit: string;
  skip: string;
};
@Controller("video")
// @ClassMiddleware([protectRoutes])
@ClassErrorMiddleware(errorHandler)
export default class VideoController {
  constructor(private service: VideoService) { }

  @Get()
  private async find(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    let { limit = defaultLimit, skip = 0 } = req.query;

    if (+limit === 0) {
      skip = 0;
    }

    const [result, error] = await this.service.findAll(+limit, +skip);
    if (error) {
      next(error);
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
    }

    res.json(result ? result.serialize() : {});
  }

  // @Post("by-name")
  // private async findOneByName(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const { name } = req.body;

  //   if (!name) next(new Error("missing name"));

  //   try {
  //     const re = new RegExp(`${name}`, "i");

  //     const video = await videoModel.find({ name: re });

  //     if (!video) throw new Error("Movie doesn't exists");

  //     res.json(video);
  //   } catch (error) {
  //     next(error);
  //   } finally {
  //     return;
  //   }
  // }

  @Post("by-fields")
  private async findOneByFields(
    req: Request<unknown, unknown, unknown, query>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const {
      name,
      episode,
      season,
      type,
      limit = defaultLimit,
      skip = 0,
    } = req.query;

    const [result, error] = await this.service.findByFields({
      name: name,
      episode: episode,
      season: season,
      type: type,
      limit: +limit,
      skip: +skip,
    });
    if (error) {
      next(error);
    }

    console.log(result);
    res.json({
      total: result.total,
      limit: +limit,
      skip: +skip,
      data: result?.data ? result.data.map(el => el.serialize()) : [],
    });
  }

  @Post()
  private async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const [result, error] = await this.service.create(req.body, {
      movieJob: true,
    });
    if (error) {
      next(error);
      return;
    }

    res.json({
      result,
    });
  }

  @Patch(":id")
  private async patch(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
  }

  @Delete(":id")
  private async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    try {
      const video = await this.service.deleteOneById(id);
      res.json(video);
    } catch (error) {
      next(error);
    }

    return;
  }

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
    }
    res.json(result);
  }
}
