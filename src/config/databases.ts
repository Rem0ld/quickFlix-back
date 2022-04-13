import mongoose from "mongoose";
import { logger } from "../libs/logger";

export default class DbConnection {
  private uri: string;
  constructor(uri: string) {
    this.uri = uri;
  }

  public connect() {
    mongoose.connect(
      this.uri,
      error => {
        if (error) {
          logger.error(error)
        }
        logger.info("Connected")
      }
    );
  }
}