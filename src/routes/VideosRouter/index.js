import VideoController from "./controller";
import router from "./router";

const controller = new VideoController();
const routes = router(controller);

export default routes;
