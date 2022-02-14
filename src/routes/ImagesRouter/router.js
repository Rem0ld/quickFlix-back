import { Router } from "express";

export default controller => {
  const router = Router();

  router.get("/", controller.find);
  router.get("/:filepath", controller.get);
  router.post("/", controller.create);
  router.patch("/", controller.patch);
  router.delete("/", controller.deleteAll);
  router.delete("/:id", controller.delete);
  return router;
};
