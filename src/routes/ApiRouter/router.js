import { Router } from "express"

export default controller => {
  const router = Router()

  router.get("/:id", controller.stream)
  return router
}
