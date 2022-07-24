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

@Controller("video")
@ClassMiddleware([protectRoutes])
@ClassErrorMiddleware(errorHandler)
export default class VideoController {
  constructor(private service: VideoService) { }

  @Get()
  private async find(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { limit = defaultLimit, skip = 0 } = req.query;

    // if (+limit === -1) {
    //   const data = await videoModel.find(request);
    //   res.json(data);
    //   return;
    // }

    try {
      const { data, total } = await this.service.findAll(+limit, +skip);
      const result =
        data.length || data.map(el => new VideoDTO(el).serialize());

      res.json({
        total,
        limit: +limit,
        skip: +skip,
        data: result,
      });
    } catch (error) {
      next(error);
    } finally {
      return;
    }
  }

  @Get(":id")
  private async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    try {
      const video = await this.service.findById(id);

      res.json(video);
    } catch (error) {
      next(error);
    } finally {
      return;
    }
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
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { name, episode, season, type, limit, skip } = req.query;

    try {
      const result = await this.service.findByFields({
        name: name.toString(),
        episode: episode.toString(),
        season: season.toString(),
        type: type as VideoTypeEnum[],
        limit: +limit,
        skip: +skip,
      });

      res.json(result);
    } catch (error) {
      next(error);
    } finally {
      return;
    }
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
    try {
      await this.service.deleteAll();

      res.statusCode = 204;
      res.statusMessage = "All entries has been removed";
      res.end();
    } catch (error) {
      next(error);
    }
    return;
  }
}
