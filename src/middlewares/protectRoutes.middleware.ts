import { NextFunction, Request, Response } from "express";
import { service as AuthService } from "../modules/Authentication";

export default function protectRoutes(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    res.status(401).json("Missing cookies auth");
    return;
  }

  const [result, error] = AuthService.verifyToken(accessToken);
  if (error) {
    res.status(401).json("Not authenticated");
    return;
  }

  if (!result) {
    res.status(401).json("JWT expired");
    return;
  }

  next();
  return;
}
