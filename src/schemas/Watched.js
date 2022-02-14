import mongoose, { Schema } from "mongoose";
import { videoModel } from "../routes/VideosRouter/controller";
import { userModel } from "./User";

const schemaWatched = new Schema(
  {
    timeWatched: Number,
    lastTimeWatched: Date,
    length: Number,
    finished: Boolean,
    stoppedAt: Number,
    video: { type: mongoose.ObjectId, ref: videoModel },
    user: { type: mongoose.ObjectId, ref: userModel },
  },
  {
    timestamps: true,
  }
);

export default schemaWatched;
