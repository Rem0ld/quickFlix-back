import { Router } from "express";

export default controller => {
  const router = Router();

  router.get("/", controller.find);
  router.get("/:id", controller.findById);
  router.post("/", controller.create);
  router.patch("/", controller.patch);
  router.delete("/", controller.deleteAll);
  router.delete("/:id", controller.delete);
  return router;
};
