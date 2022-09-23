import { Request, Response, NextFunction } from "express";
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  ClassErrorMiddleware,
} from "@overnightjs/core";
import errorHandler from "../../services/errorHandler";
import UserService from "./User.service";
import { User } from "./User.entity";
import { defaultLimit } from "../../config/defaultConfig";

@Controller("user")
@ClassErrorMiddleware(errorHandler)
export default class UserController {
  constructor(private service: UserService) {}

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
  ): Promise<void> {}

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
