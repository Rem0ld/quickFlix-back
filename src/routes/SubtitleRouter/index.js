import SubtitleController from "./controller";
import router from "./router";

const controller = new SubtitleController();
const routes = router(controller);

export default routes;
