import UserController from "./controller"
import router from "./router"

const controller = new UserController()
const routes = router(controller)

export default routes
