import WatchedController from "./controller";
import router from "./router";

const controller = new WatchedController();
const routes = router(controller);

export default routes;
