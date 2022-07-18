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
    try {
      const { pseudo, password } = req.body;
      if (!pseudo || !password) {
        throw new Error("missing parameters");
      }
      const user = await this.service.authenticate(pseudo, password);
      res.json(user);
    } catch (error) {
      next(error);
    } finally {
      return;
    }
  }

  @Post("check")
  private async checkToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token } = req.body;
      if (!token) {
        throw new Error("missing parameter");
      }
      const result = this.service.parseToken(token);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  @Post("new-token")
  private async generateNewToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token } = req.body;
      if (!token) {
        throw new Error("missing parameter");
      }
      const newToken = await this.service.generateNewToken(token);
      console.log(newToken)
      res.json(newToken);
    } catch (error) {
      next(error);
    }
  }

  @Delete(":id")
  private async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> { }
}
