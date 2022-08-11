import { AppDataSource } from "../../data-source";
import { MovieDbJobRepository } from "./MovieDbJob.repository";
import MovieDbJobService from "./MovieDbJob.service";
import MovieDbJobController from "./MovieDbJob.controller";

const repo = new MovieDbJobRepository(AppDataSource.manager);
export const service = new MovieDbJobService(repo);
const controller = new MovieDbJobController(service);

export default controller;
