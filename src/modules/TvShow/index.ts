import { AppDataSource } from "../../data-source";
import TvShowController from "./TvShow.controller";
import { TvShowRepository } from "./TvShow.repository";
import TvShowService from "./TvShow.service";

const repo = new TvShowRepository(AppDataSource.manager);
const service = new TvShowService(repo);
const controller = new TvShowController(service);

export default controller;
