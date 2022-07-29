import videoController from "./Video/index"
import tvShowController from "./TvShow/index"
import userController from './User/index'
import authController from './Authentication/index'
import discoverController from "./Discover/index"

const routes = [
  videoController,
  tvShowController,
  userController,
  authController,
  discoverController
]

export default routes;