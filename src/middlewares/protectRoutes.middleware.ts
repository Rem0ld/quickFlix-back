import { NextFunction, Request, Response } from "express";
import { service as AuthService } from "../modules/Authentication";

export default function protectRoutes(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    res.status(401).json("Missing jwt");
  }

  // I'm throwing error from AuthService so no need to use if..else
  try {
    AuthService.verifyToken(accessToken);
    next();
  } catch (error) {
    next(error);
  }

  return;
}
