import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import { Server } from "@overnightjs/core";
import routes from "../modules";
import { logger } from "../libs/logger";

export default class MyServer extends Server {
  constructor() {
    super(process.env.NODE_ENV === "development");
    dotenv.config();
    this.showLogs = true;
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(morgan("combined"));
    this.app.use(cors());
    this.setupController();
  }

  private setupController(): void {
    logger.info("Setting up controllers")
    // all controllers goes here
    // connection to db
    // const streamController = new StreamController();
    // const imagesController = new ImageController();
    // const movieDbJobController = new MovieDbJobController();
    // const subtitleController = new SubtitleController();
    // const tvShowController = new TvShowController();
    // const discoverController = new DiscoverController();
    // const watchedController = new WatchedController();
    // const watchedTvShowController = new WatchedTvShowController();
    // const encodingJobController = new EncodingJobController();

    super.addControllers(routes);
  }

  public start(port: string): void {
    this.app.listen(port, () => {
      logger.info(`Listening on ${port}`);
      logger.info(`Environment is ${process.env.NODE_ENV}`);
      // log(`Db string is ${process.env.DB_CONNECTION_STRING}`)
    });
  }
}
