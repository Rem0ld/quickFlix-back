import StreamService from "./Stream.service";
import StreamController from "./Stream.controller";
import { service as vs } from "../Video/index";

const service = new StreamService(vs);
const controller = new StreamController(service);

export default controller;
