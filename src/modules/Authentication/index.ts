import AuthenticationService from "./Authentication.service";
import { service as userService } from "../User/index";
import AuthenticationController from "./Authentication.controller";

export const service = new AuthenticationService(userService);
const controller = new AuthenticationController(service);

export default controller;
