import mongoose, { model, Schema } from "mongoose";
import { videoModel } from "./Video";

const schemaTvShow = new Schema(
  {
    idMovieDb: String,
    name: String,
    numberSeason: Number,
    numberEpisode: Number,
    seasons: [
      {
        number: String,
        episodes: [{ number: String, ref: { type: mongoose.ObjectId, ref: videoModel } }],
      },
    ],
    ongoing: Boolean,
    originCountry: String,
    posterPath: String,
    resume: String,
    score: Number,
    date: Date,
    trailerYtCode: String,
  },
  {
    timestamps: true,
  }
);

export const tvShowModel = model("season", schemaTvShow);

export default schemaTvShow;
