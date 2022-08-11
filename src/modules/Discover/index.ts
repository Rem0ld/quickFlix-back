import DiscoverService from "./Discover.service";
import { service as vService } from "../Video";
import { service as tService } from "../TvShow";
import { service as mService } from "../MovieDbJob";
import DiscoverController from "./Discover.controller";

const service = new DiscoverService(vService, tService, mService);
const controller = new DiscoverController(service);

export default controller;
