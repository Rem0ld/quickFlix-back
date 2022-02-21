import mongoose, { model, Schema } from "mongoose";
import { videoModel } from "./Video";
import { Watched } from "../types";
import { userModel } from "./User";

const schemaWatched = new Schema<Watched>(
  {
    timeWatched: Number,
    length: Number,
    finished: { Type: Boolean, default: false },
    video: { type: Schema.Types.ObjectId, ref: videoModel, index: true },
    user: { type: Schema.Types.ObjectId, ref: userModel },
  },
  {
    timestamps: true,
  }
);

export const watchedModel = model<Watched>("user", schemaWatched)
export default schemaWatched;
