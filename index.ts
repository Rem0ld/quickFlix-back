import MyServer from "./src/config/server";

const port = process.env.PORT || "3000";
const server = new MyServer();

server.start(port)