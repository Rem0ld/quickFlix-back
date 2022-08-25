import videoController from "./Video/index";
import tvShowController from "./TvShow/index";
import userController from "./User/index";
import authController from "./Authentication/index";
import discoverController from "./Discover/index";
import movieDbJobController from "./MovieDbJob/index";
import imageController from "./Image/index";
import streamController from "./Stream/index";

const routes = [
  videoController,
  tvShowController,
  userController,
  authController,
  discoverController,
  movieDbJobController,
  imageController,
  streamController,
];

export default routes;
