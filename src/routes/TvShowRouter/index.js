import TvShowController from "./controller"
import router from "./router"

const controller = new TvShowController()
const routes = router(controller)

export default routes
