import mongoose, { model, Schema } from "mongoose";
import { videoModel } from "./Video";

const schemaTvShow = new Schema(
  {
    idMovieDb: String, // id
    name: String,
    location: String,
    numberSeason: Number, // number_of_episodes
    numberEpisode: Number, // number_of_seasons
    seasons: [
      {
        number: String,
        episodes: [{ number: String, ref: { type: mongoose.ObjectId, ref: videoModel } }],
      },
    ],
    ongoing: Boolean, // in_production
    originCountry: [String], // origin_country
    posterPath: [String], // see if I can dl it poster_path
    resume: String, // overview
    score: Number, // vote_average
    genres: [String], // genre
    firstAirDate: Date, // first_air_date
    trailerYtCode: [String],
  },
  {
    timestamps: true,
  }
);

export const tvShowModel = model("season", schemaTvShow);

export default schemaTvShow;
