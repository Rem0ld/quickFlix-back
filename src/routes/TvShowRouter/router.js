import { Router } from "express";

export default controller => {
  const router = Router();

  router.get("/", controller.find);
  router.get("/:id", controller.findById);
  router.post("/by-name", controller.findOneByName);
  router.post("/", controller.create);
  router.patch("/", controller.patch);
  router.delete("/:id", controller.delete);
  return router;
};
