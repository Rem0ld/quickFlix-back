import Express from "express";
import Server from "./src/config/server";
import dotenv from "dotenv";
import middlewares from "./src/config/middlewares";
import routes from "./src/routes";
dotenv.config();

const port = process.env.PORT;
const app = Express();
const server = new Server(app);

server.middlewares(middlewares);
server.routes(routes);
server.start(port);
