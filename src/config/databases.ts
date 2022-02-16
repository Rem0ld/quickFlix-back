import mongoose from "mongoose";

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
          // TODO: log for db connection error
          console.log(error);
        }
        console.log("Connected")
      }
    );
  }
}