import mongoose, { model, Schema } from "mongoose";
import { videoModel } from "./Video";

const schemaMovieDbJob = new Schema({
  video: { type: mongoose.ObjectId, ref: videoModel },
  status: { type: String, enum: ["todo", "done", "error"], default: "todo" },
  error: [String],
  type: { type: String, enum: ["tv", "movie"], default: "movie" },
});

export const movieDbJobModel = model("movieDbJob", schemaMovieDbJob);
export default schemaMovieDbJob;
