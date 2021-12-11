import express from "express";
import morgan from "morgan";

const middlewares = {
  json: express.json(),
  urlencoded: express.urlencoded({ extended: false }),
  morgan: morgan("combined"),
};

export default middlewares;
