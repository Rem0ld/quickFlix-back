import { Router } from "express";

export default controller => {
  const router = Router();

  router.get("/", controller.discover);
  router.get("/subtitles", controller.discoverSubtitles);
  router.get("/details", controller.discoverDetails);
  router.get("/test", controller.discoverTest);

  return router;
};
