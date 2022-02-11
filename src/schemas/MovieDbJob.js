import mongoose, { model, Schema } from "mongoose";
import { videoModel } from "./Video";

const schemaMovieDbJob = new Schema({
  video: { type: mongoose.ObjectId, ref: videoModel },
  status: { type: String, enum: ["todo", "done", "error"] },
  error: [String],
});

export const movieDbJobModel = model("movieDbJob", schemaMovieDbJob);
export default schemaMovieDbJob;
