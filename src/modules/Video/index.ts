import { AppDataSource } from "../../data-source";
import VideoController from "./Video.controller";
import VideoRepository from "./Video.repository";
import VideoService from "./Video.service";

const manager = AppDataSource.manager;
const repo = new VideoRepository(manager);
const service = new VideoService(repo);
const videoController = new VideoController(service);

export default videoController;
