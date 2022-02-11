import MovieDbJobController from "./controller";
import router from "./router";

const controller = new MovieDbJobController();
const routes = router(controller);

export default routes;
