import { Request, Response, NextFunction } from "express";
import {
  Controller,
  Post,
  Delete,
  ClassErrorMiddleware,
} from "@overnightjs/core";
import errorHandler from "../../services/errorHandler";
import AuthenticationService from "./Authentication.service";

@Controller("authentication")
@ClassErrorMiddleware(errorHandler)
export default class AuthenticationController {
  constructor(private service: AuthenticationService) { }

  @Post()
  private async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { pseudo, password } = req.body;
    try {
      const user = await this.service.authenticate(pseudo, password);
      res.json(user);
    } catch (error) {
      next(error);
    } finally {
      return;
    }
  }

  @Delete(":id")
  private async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> { }
}
