import { model, Schema } from "mongoose"
import { subtitleModel } from "./Subtitles"

const schemaVideo = new Schema(
  {
    name: String,
    baseName: String,
    type: String,
    date: Date,
    score: Number,
    length: Number,
    resume: String,
    director: String,
    writers: String,
    stars: String,
    location: String,
    trailer: String,
    subtitles: [{ ref: subtitleModel }],
  },
  {
    timestamps: true,
  }
)

export const videoModel = model("video", schemaVideo)
export default schemaVideo
