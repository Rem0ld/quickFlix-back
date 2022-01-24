import mongoose, { model, Schema } from "mongoose";
import { subtitleModel } from "./Subtitles";

const schemaVideo = new Schema(
  {
    idMovieDb: String,
    name: String,
    basename: String,
    filename: String,
    ext: String,
    location: String,
    type: { type: String, enum: ["movie", "tv"] },
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
    flags: {
      wrongFormat: Boolean,
      needSubtitles: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

export const videoModel = model("video", schemaVideo);
export default schemaVideo;
// TODO: If wrongFormat
// creation of a new collection with videos we need to download with a different format
// which links to the video so we can delete it when we have the new one
