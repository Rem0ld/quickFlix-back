import Express from "express"
import Server from "./src/config/server"
import dotenv from "dotenv"
import middlewares from "./src/config/middlewares"
import routes from "./src/routes"
import mongoose from "mongoose"

dotenv.config()

const port = process.env.PORT
const app = Express()
mongoose.connect(
  process.env.NODE_ENV === "development"
    ? process.env.DB_CONNECTION_STRING
    : "mongodb://amdin:1234@localhost:27017/db_quickFlix",
  () => {
    console.log("connected")
    console.log(process.env.NODE_ENV)
    if (process.env.NODE_ENV === "development") {
      console.log(process.env.DB_CONNECTION_STRING)
    } else {
      console.log("mongodb://amdin:1234@localhost:27017/db_quickFlix")
    }
  }
)
const server = new Server(app)

server.middlewares(middlewares)
server.routes(routes)
server.start(port)
