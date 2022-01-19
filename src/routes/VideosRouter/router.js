import { Router } from "express"

export default controller => {
  const router = Router()

  router.get("/", controller.find)
  router.post("/", controller.create)
  router.delete("/", controller.delete)
  return router
}
