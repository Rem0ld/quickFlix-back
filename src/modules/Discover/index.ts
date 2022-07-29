import DiscoverService from "./Discover.service";
import { service as vService } from "../Video";
import { service as tService } from "../TvShow";
import DiscoverController from "./Discover.controller";

const service = new DiscoverService(vService, tService);
const controller = new DiscoverController(service);

export default controller;
