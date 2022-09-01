import { Request, Response, NextFunction } from "express";
import {
  Controller,
  Post,
  Delete,
  ClassErrorMiddleware,
} from "@overnightjs/core";
import errorHandler from "../../services/errorHandler";
import AuthenticationService from "./Authentication.service";
import { MissingDataPayloadException } from "../../services/Error";

@Controller("authentication")
@ClassErrorMiddleware(errorHandler)
export default class AuthenticationController {
  constructor(private service: AuthenticationService) {}

  @Post()
  private async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { pseudo, password } = req.body;
    if (!pseudo || !password) {
      next(new MissingDataPayloadException("pseudo, password"));
    }
    const [result, error] = await this.service.authenticate(pseudo, password);
    if (error) {
      next(error);
      return;
    }
    res
      .cookie("access_token", result.token, {
        maxAge: 1000 * 3600 * 24 * 365,
        httpOnly: true,
        secure: true,
        signed: true,
      })
      .json(result.user);
    return;
  }

  @Post("check")
  private async checkToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { token } = req.body;
    if (!token) {
      next(new MissingDataPayloadException("token"));
    }
    const result = this.service.parseToken(token);

    res.json(result);
  }

  @Post("new-token")
  private async generateNewToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { token } = req.body;
    if (!token) {
      next(new MissingDataPayloadException("token"));
    }
    const [newToken, error] = await this.service.generateNewToken(token);
    if (error) {
      next(error);
      return;
    }

    res.json(newToken);
  }

  @Delete(":id")
  private async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {}
}
