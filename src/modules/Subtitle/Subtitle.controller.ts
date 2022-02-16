import { defaultLimit } from "../../config/defaultConfig";
import { Request, Response, NextFunction } from 'express';
import { Controller, Middleware, ErrorMiddleware, Get, Post, Put, Patch, Delete, ClassErrorMiddleware } from "@overnightjs/core"
import errorHandler from "../../services/errorHandler";
import { subtitleModel } from "../../schemas/Subtitles";
import { AppResponse, PaginatedResponse, Subtitle } from "../../types";

@Controller("subtitle")
@ClassErrorMiddleware(errorHandler)
export default class SubtitleController {
  @Get()
  private async find(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { limit = defaultLimit, skip = 0 } = req.query;

    if (+limit === -1) {
      const subtitles: Subtitle[] = await subtitleModel.find();
      res.json(subtitles);
      return
    }

    try {
      const count = await subtitleModel.countDocuments();
      const data = await subtitleModel
        .find()
        .skip(+skip)
        .limit(+limit);

      // Here I make sure we are following pagination rules
      const response: PaginatedResponse<Subtitle[]> = {
        total: count,
        limit: +limit,
        skip: +skip,
        data,
      }

      res.json(response);
      return
    } catch (error) {
      next(error);
      return
    }

  }

  @Get(":id")
  private async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;

    if (!id) {
      next(new Error("Missing id"))
      return;
    }

    const subtitle: Subtitle | null = await subtitleModel.findById(id);

    if (!subtitle) {
      next(new Error("Subtitle doesnt exists"));
      return;
    }

    res.json(subtitle);
    return;
  }

  @Post()
  private async create(req: Request, res: Response, next: NextFunction): Promise<void> {
  }

  @Patch(":id")
  private async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
  }

  @Delete(":id")
  private async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
  }

  // TODO: middleware to check if admin
  @Delete()
  private async deleteAll(_: Request, res: Response, next: NextFunction): Promise<void> {
    const subtitles = await subtitleModel.deleteMany();

    res.json(`${subtitles.deletedCount} removed`);
  }
}