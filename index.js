import Express from "express";
import Server from "./src/config/server";
import dotenv from "dotenv";
import middlewares from "./src/config/middlewares";
import routes from "./src/routes";
import mongoose from "mongoose";

dotenv.config();

const port = process.env.PORT;
const app = Express();
mongoose.connect(
  process.env.NODE_ENV === "development"
    ? process.env.DB_CONNECTION_STRING
    : "mongodb://amdin:1234@localhost:27017/db_quickFlix?authSource=admin",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  error => {
    if (error) {
      // TODO: log for db connection error
      console.log(error);
    }
  }
);
const server = new Server(app);

server.middlewares(middlewares);
server.routes(routes);
server.start(port);
