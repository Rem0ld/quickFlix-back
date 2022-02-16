import mongoose, { model, Schema } from "mongoose";
import { videoModel } from "./Video";
import { Watched } from "../types";
import { userModel } from "./User";

const schemaWatched = new Schema<Watched>(
  {
    timeWatched: Number,
    length: Number,
    finished: { Type: Boolean, default: false },
    stoppedAt: Number,
    video: { type: Schema.Types.ObjectId, ref: videoModel },
    user: { type: Schema.Types.ObjectId, ref: userModel },
  },
  {
    timestamps: true,
  }
);

export const watchedModel = model<Watched>("user", schemaWatched)

export default schemaWatched;
