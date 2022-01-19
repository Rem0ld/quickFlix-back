import express from "express"
import morgan from "morgan"
import cors from "cors"

const middlewares = {
  json: express.json(),
  urlencoded: express.urlencoded({ extended: false }),
  morgan: morgan("combined"),
  cors: cors(),
}

export default middlewares
