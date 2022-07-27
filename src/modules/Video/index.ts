import { AppDataSource } from "../../data-source";
import VideoController from "./Video.controller";
import VideoRepository from "./Video.repository";
import VideoService from "./Video.service";

const repo = new VideoRepository(AppDataSource.manager);
const service = new VideoService(repo);
const controller = new VideoController(service);

export default controller;
