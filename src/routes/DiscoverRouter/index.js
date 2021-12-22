
import DiscoverController from './controller'
import router from './router'

const controller = new DiscoverController();
const routes = router(controller)

export default routes;