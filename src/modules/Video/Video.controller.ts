import { defaultLimit } from "../../config/defaultConfig";
import { Request, Response, NextFunction } from 'express';
import { Controller, Middleware, ErrorMiddleware, Get, Post, Put, Patch, Delete, ClassErrorMiddleware } from "@overnightjs/core"
import errorHandler from "../../services/errorHandler";
import VideoService from "./Video.service";
import { RequestBuilder } from "../../types";
import { videoModel } from "../../schemas/Video";

@Controller("video")
@ClassErrorMiddleware(errorHandler)
export default class VideoController {
  @Get()
  private async find(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { limit = defaultLimit, skip = 0, movie = false } = req.query;
    const request: RequestBuilder = {};

    if (movie) {
      request.type = "movie";
    }

    if (+limit === -1) {
      const data = await videoModel.find(request);
      res.json(data);
      return;
    }

    try {
      const count = await videoModel.countDocuments();
      const data = await videoModel
        .find(request)
        .skip(+skip)
        .limit(+limit);

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
  private async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;

    if (!id) {
      next(new Error("Missing ID"))
    }

    try {
      const video = await videoModel.findById(id);

      if (!video) {
        throw new Error("Video doesn't exists");
      }

      res.json(video);
    } catch (error) {
      next(error);
    }
    return;
  }

  @Post("by-name")
  private async findOneByName(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name } = req.body;

    if (!name) next(new Error("missing name"));

    try {
      const re = new RegExp(`${name}`, "i");

      const video = await videoModel.find({ name: re });

      if (!video) throw new Error("Movie doesn't exists");

      res.json(video);
    } catch (error) {
      next(error);
    }
    return;
  }

  @Post("by-fields")
  private async findOneByFields(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await VideoService.findByFields(req.body);

      if (!result) throw new Error("Internal Server Error");

      res.json(result);
    } catch (error) {
      next(error);
    }
    return;
  }

  @Post()
  private async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.body.name) {
      next(new Error("missing name"));
    }

    const video = await VideoService.create(req.body, { movieJob: true });

    res.json({
      video,
    });
    return;
  }

  @Patch(":id")
  private async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await videoModel.updateOne(req.body);

      if (!result) throw new Error("Internal Server Error");

      res.json(result)
    } catch (err) {
      next(err)
    }
    return;
  }

  @Delete(":id")
  private async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { _id: id } = req.params;

    if (!id) {
      next(new Error("Missing ID"));
    }

    const video = await VideoService.deleteOneById(id);

    if (!video) {
      next(new Error("Internal Server Error"));
    }

    res.json(video);
    return;
  }

  // TODO: middleware to check if admin
  @Delete()
  private async deleteAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    // See function signature
    const result = await VideoService.deleteAll();

    res.json(result);
  }
}