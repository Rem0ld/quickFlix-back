import { NextFunction, Request, Response } from "express";

export default function verifyAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = req.query.user as string;

  if (!JSON.parse(user).isAdmin) {
    res.status(401).json("Unauthorized");
    return;
  }
  next();
  return;
}
