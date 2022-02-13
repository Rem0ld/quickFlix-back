import mongoose, { model, Schema } from "mongoose";
import { subtitleModel } from "./Subtitles";

const schemaVideo = new Schema(
  {
    idMovieDb: String, // id
    name: String,
    basename: String,
    filename: String,
    ext: String,
    location: String,
    type: { type: String, enum: ["movie", "tv"] },
    episode: String,
    season: String,
    releaseDate: Date, // release_date
    score: Number, // vote_average
    length: Number, // runtime - in minutes
    resume: String, // overview
    director: String,
    writers: String,
    stars: String,
    trailer: String,
    genres: [String], // genres
    subtitles: [{ type: mongoose.ObjectId, ref: subtitleModel }],
    trailerYtCode: [String],
    posterPath: [String], // poster_path
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
