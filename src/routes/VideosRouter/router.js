import { Router } from "express";

export default controller => {
  const router = Router();

  router.get("/", controller.find);
  router.get("/:id", controller.findById);
  router.post("/by-name", controller.findOneByName);
  router.post("/by-fields", controller.findByFields);
  router.post("/", controller.create);
  router.patch("/", controller.update);
  router.delete("/:id", controller.delete);
  router.delete("/", controller.deleteAll);
  return router;
};
