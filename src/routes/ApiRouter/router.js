import { Router } from "express";

export default (controller) => {
  const router = Router();

  router.get("/:filename", controller.stream);
  return router;
};
