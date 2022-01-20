import mongoose, { model, Schema } from "mongoose"
import { subtitleModel } from "./Subtitles"

const schemaVideo = new Schema(
  {
    idMovieDb: String,
    name: String,
    basename: String,
    filename: String,
    ext: String,
    location: String,
    type: [{ type: String, enum: ["movie", "tv"] }],
    episode: String,
    season: String,
    date: Date,
    score: Number,
    length: Number,
    resume: String,
    director: String,
    writers: String,
    stars: String,
    trailer: String,
    subtitles: [{ type: mongoose.ObjectId, ref: subtitleModel }],
    trailerYtCode: String,
    posterPath: String,
  },
  {
    timestamps: true,
  }
)

export const videoModel = model("video", schemaVideo)
export default schemaVideo
