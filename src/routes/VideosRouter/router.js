import { Router } from "express"

export default controller => {
  const router = Router()

  router.get("/", controller.find)
  router.post("/", controller.create)
  router.delete("/:id", controller.delete)
  router.delete("/", controller.deleteAll)
  return router
}
