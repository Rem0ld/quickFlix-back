import express from 'express';
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'

import { Server } from '@overnightjs/core'
import { log } from 'console';
import StreamController from '../modules/Stream/Stream.controller';
import DbConnection from './databases';
import ImageController from '../modules/Image/ImageController';
import MovieDbJobController from '../modules/MovieDbJob/MovieDbJob.controller';
import SubtitleController from '../modules/Subtitle/Subtitle.controller';
import TvShowController from '../modules/TvShow/TvShow.controller';
import VideoController from '../modules/Video/Video.controller';
import DiscoverController from '../modules/Discover/Discover.controller';

export default class MyServer extends Server {
  constructor() {
    super(process.env.NODE_ENV === "development");
    dotenv.config()
    this.showLogs = true;
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(morgan('combined'))
    this.app.use(cors())
    this.setupController()
  }

  private setupController(): void {
    // all controllers goes here
    // connection to db
    const streamController = new StreamController();
    const imagesController = new ImageController();
    const movieDbJobController = new MovieDbJobController();
    const subtitleController = new SubtitleController();
    const tvShowController = new TvShowController();
    const videoController = new VideoController();
    const discoverController = new DiscoverController();

    const uri = process.env.NODE_ENV === "development" ?
      process.env.DB_CONNECTION_STRING :
      "mongodb://amdin:1234@localhost:27017/db_quickFlix?authSource=admin";

    const db = new DbConnection(uri!)
    db.connect()
    super.addControllers(
      [streamController, imagesController,
        movieDbJobController, subtitleController,
        tvShowController, videoController,
        discoverController]
    )
  }

  public start(port: string): void {
    this.app.listen(port, () => {
      log(`Listening on ${port}`)
    })
  }
}