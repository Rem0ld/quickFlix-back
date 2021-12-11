import ApiController from "./controller";
import router from "./router";

const controller = new ApiController();
const routes = router(controller);

export default routes;
