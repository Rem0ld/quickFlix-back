import { AppDataSource } from "../../data-source";
import WatchedController from "../Watched/Watched.controller";
import WatchedTvShowController from "./WatchedTvShow.controller";
import { WatchedTvShowRepository } from "./WatchedTvShow.repository";
import WatchedTvShowService from "./WatchedTvShow.service";

const manager = AppDataSource.manager;
const repo = new WatchedTvShowRepository(manager)
const service = new WatchedTvShowService(repo)
const controller = new WatchedTvShowController(service)

export default controller;