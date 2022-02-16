import { Request, Response, NextFunction } from 'express'

export default (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error.message.includes("Cast to ObjectId failed")) {
    res.status(500).json("Wrong type id");
  }

  if (error.message.includes("exists")) {
    res.status(404).json(error.message);
  }

  if (error.message.includes("missing")) {
    res.status(400).json(error.message);
  }

  if (error.message.includes("internal")) {
    res.status(500).json(error.message);
  }

  res.status(500).json(error.message);
};
