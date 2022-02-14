import ImageController from "./controller";
import router from "./router";

const controller = new ImageController();
const routes = router(controller);

export default routes;
