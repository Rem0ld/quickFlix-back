import { logger } from "../libs/logger";

export default class DbConnection {
  private uri: string;
  constructor(uri: string) {
    this.uri = uri;
  }

  public connect() {
  }
}