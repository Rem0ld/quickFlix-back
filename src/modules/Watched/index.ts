import { AppDataSource } from "../../data-source";
import WatchedController from "./Watched.controller";
import WatchedRepository from "./Watched.repository";
import WatchedService from "./Watched.service";

const manager = AppDataSource.manager;
const repo = new WatchedRepository(manager)
const service = new WatchedService(repo)
const controller = new WatchedController(service)

export default controller;