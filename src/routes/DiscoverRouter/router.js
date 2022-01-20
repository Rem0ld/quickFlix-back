import { Router } from "express"

export default controller => {
  const router = Router()

  router.get("/", controller.discover)
  router.get("/subtitles", controller.discoverSubtitles)

  return router
}
