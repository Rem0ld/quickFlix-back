import path from "path";
import {
  Controller,
  Middleware,
  ErrorMiddleware,
  Get,
  Post,
  Put,
  Delete,
  ClassErrorMiddleware,
  Patch,
} from "@overnightjs/core";
import errorHandler from "../../services/errorHandler";
import { Request, Response, NextFunction } from "express";
import { logger } from "../../libs/logger";

@Controller("images")
@ClassErrorMiddleware(errorHandler)
export default class ImageController {
  @Get(":filepath")
  async get(req: Request, res: Response, next: NextFunction) {
    const options = {
      root: path.resolve("./public"),
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true,
      },
    };
    const { filepath } = req.params;

    if (!filepath) {
      next(new Error("Missing filename"));
      return;
    }

    res.sendFile(`images/${filepath}`, options, err => {
      if (err) next(err);
    });
    return;
  }
  @Patch(":id")
  async patch(req: Request, res: Response, next: NextFunction) {}
  @Post()
  async create(req: Request, res: Response, next: NextFunction) {}
  @Get()
  async find(req: Request, res: Response, next: NextFunction) {}
  @Delete(":id")
  async delete(req: Request, res: Response, next: NextFunction) {}
  // TODO: add middleware to authorized admin only
  @Delete()
  async deleteAll(req: Request, res: Response, next: NextFunction) {}
}
