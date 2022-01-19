import ApiRouter from "./ApiRouter"
import DiscoverRouter from "./DiscoverRouter"
import VideoRouter from "./VideosRouter"

export default {
  "/api": ApiRouter,
  "/discover": DiscoverRouter,
  "/video": VideoRouter,
}
