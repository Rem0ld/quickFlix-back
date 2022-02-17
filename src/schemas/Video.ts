import mongoose, { model, Schema } from "mongoose";
import { subtitleModel } from "./Subtitles";
import { Video } from "../types";

const schemaVideo =
  new Schema<Video>({
    idMovieDb: { type: String, index: true }, // id
    name: { type: String, index: true },
    basename: String,
    filename: String,
    ext: String,
    location: String,
    type: { type: String, enum: ["movie", "tv", "trailer", "teaser"], index: true },
    episode: String,
    season: String,
    year: Date,
    releaseDate: Date, // release_date
    score: Number, // vote_average
    length: Number, // runtime - in minutes
    resume: String, // overview
    director: [String],
    writers: [String],
    actors: [String],
    trailer: [{ type: Schema.Types.ObjectId, ref: this }],
    genres: [String], // genres
    subtitles: [{ type: Schema.Types.ObjectId, ref: subtitleModel }],
    trailerYtCode: [String],
    posterPath: [String], // poster_path
    flags: {
      wrongFormat: Boolean,
      needSubtitles: Boolean,
    },
  },
    {
      timestamps: true,
    });

export const videoModel = model<Video>("video", schemaVideo);

export default schemaVideo;
// TODO: If wrongFormat
// creation of a new collection with videos we need to download with a different format
// which links to the video so we can delete it when we have the new one
