import { defaultLimit } from "../../config/defaultConfig";
import { Request, Response, NextFunction } from 'express';
import { Controller, Middleware, ErrorMiddleware, Get, Post, Put, Patch, Delete, ClassErrorMiddleware } from "@overnightjs/core"
import errorHandler from "../../services/errorHandler";

@Controller("")
@ClassErrorMiddleware(errorHandler)
export default class {
  @Get()
  private async find(req: Request, res: Response, next: NextFunction): Promise<void> {

  }
  @Get(":id")
  private async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
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
  private async deleteAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  }
}