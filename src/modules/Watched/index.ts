import { AppDataSource } from "../../data-source";
import WatchedController from "./Watched.controller";
import WatchedRepository from "./Watched.repository";
import WatchedService from "./Watched.service";

const repo = new WatchedRepository(AppDataSource.manager)
const service = new WatchedService(repo)
const controller = new WatchedController(service)

export default controller;