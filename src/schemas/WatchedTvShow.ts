import mongoose, { model, Schema } from "mongoose";
import { Watched, WatchedTvShow } from "../types";
import { userModel } from "./User";
import { tvShowModel } from "./TvShow";
import { watchedModel } from "./Watched";
import { videoModel } from "./Video";

const schemaWatchedTvShow = new Schema<WatchedTvShow>(
  {
    tvShow: { type: String, index: true },
    videos: [{
      watchedId: { type: Schema.Types.ObjectId, ref: watchedModel, index: true },
      videoId: { type: Schema.Types.ObjectId, ref: videoModel, index: true }
    }],
    user: { type: Schema.Types.ObjectId, ref: userModel },
  },
  {
    timestamps: true,
  }
);

export const watchedTvShowModel = model<WatchedTvShow>("watchedTvShow", schemaWatchedTvShow)
export default schemaWatchedTvShow;
