import { AppDataSource } from "../../data-source";
import VideoController from "./Video.controller";
import VideoRepository from "./Video.repository";
import VideoService from "./Video.service";
import { service as mjSer } from "../MovieDbJob/index";

const repo = new VideoRepository(AppDataSource.manager);
export const service = new VideoService(repo, mjSer);
const controller = new VideoController(service);

export default controller;
