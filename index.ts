import connection from "./src/config/databases";
import MyServer from "./src/config/server";
import { logger } from "./src/libs/logger";

const port = process.env.PORT || "3000";
const server = new MyServer();

(async () => {
  try {
    server.start(port);
    await connection.create();
  } catch (error) {
    logger.error("Cannot start db", error);
  }
})();
