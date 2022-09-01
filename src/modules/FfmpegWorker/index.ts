import ffmpeg from "fluent-ffmpeg";
import { service as vs } from "../Video/index";
import FfmpegWorkerController from "./FfmpegWorker.controller";
import FfmpegWorkerService from "./FfmpegWorker.service";

const command = ffmpeg();
export const service = new FfmpegWorkerService(command, vs);
const controller = new FfmpegWorkerController(service);

export default controller;
