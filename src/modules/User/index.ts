import { AppDataSource } from "../../data-source";
import UserController from "./User.controller";
import UserRepository from "./User.repository";
import UserService from "./User.service";

const repo = new UserRepository(AppDataSource.manager);
export const service = new UserService(repo);
const controller = new UserController(service);

export default controller;
