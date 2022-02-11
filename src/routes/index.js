import ApiRouter from "./ApiRouter";
import DiscoverRouter from "./DiscoverRouter";
import VideoRouter from "./VideosRouter";
import SubtitleRouter from "./SubtitleRouter";
import UserRouter from "./UserRouter";
import TvShowRouter from "./TvShowRouter";
import MovieJobRouter from "./MovieDbJobRouter";

export default {
  "/api": ApiRouter,
  "/discover": DiscoverRouter,
  "/video": VideoRouter,
  "/user": UserRouter,
  "/subtitle": SubtitleRouter,
  "/tv-show": TvShowRouter,
  "/movie-job": MovieJobRouter,
};
