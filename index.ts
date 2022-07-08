import MyServer from "./src/config/server";
import { AppDataSource } from "./src/data-source";
import { logger } from "./src/libs/logger";

const port = process.env.PORT || "3000";
const server = new MyServer();

(async () => {
  try {
    await AppDataSource.initialize()
    server.start(port)
  } catch (error) {
    logger.error("Cannot start db", error)
  }
})