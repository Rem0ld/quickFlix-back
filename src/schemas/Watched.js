import { Schema, ObjectId } from "mongoose"
import { videoModel } from "../routes/VideosRouter/controller"
import { userModel } from "./User"

const schemaWatched = new Schema(
  {
    timeWatched: Number,
    lastTimeWatched: Date,
    finished: Boolean,
    stoppedAt: Number,
    video: { type: ObjectId, ref: videoModel },
    user: { type: ObjectId, ref: userModel },
  },
  {
    timestamps: true,
  }
)

export default schemaWatched
