import { Router } from "express";

export default (controller ) => {
  const router = Router();

  router.get("/", controller.discover);
  return router;
}