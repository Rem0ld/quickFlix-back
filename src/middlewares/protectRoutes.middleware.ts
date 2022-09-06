import { NextFunction, Request, Response } from "express";
import { service as AuthService } from "../modules/Authentication";
import { UserDTO } from "../modules/User/User.dto";

export default function protectRoutes(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { access_token: accessToken } = req.signedCookies;

  if (!accessToken) {
    res.status(401).json("Missing cookies auth");
    return;
  }

  const [result, error] = AuthService.parseToken(accessToken);
  if (error) {
    res.status(401).json(error);
    return;
  }

  if (!result) {
    res.status(401).json("JWT expired");
    return;
  }

  req.query.user = JSON.stringify(result);
  next();
  return;
}
