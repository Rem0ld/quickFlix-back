import mongoose, { model, Schema } from "mongoose";
import { MovieDbJob } from "../types";
import { videoModel } from "./Video";

const schemaMovieDbJob = new Schema<MovieDbJob>({
  video: { type: Schema.Types.ObjectId, ref: videoModel },
  status: { type: String, enum: ["todo", "done", "error"], default: "todo", index: true },
  error: [String],
  type: { type: String, enum: ["tv", "movie", "trailer", "teaser"], default: "movie", index: true },
});

export const movieDbJobModel = model<MovieDbJob>("movieDbJob", schemaMovieDbJob);
export default schemaMovieDbJob;
