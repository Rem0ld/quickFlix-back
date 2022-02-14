import { Router } from "express";

export default controller => {
  const router = Router();

  router.get("/", controller.find);
  router.get("/:id", controller.findById);
  router.post("/video", controller.findByVideoId);
  router.patch("/", controller.patch);
  return router;
};
