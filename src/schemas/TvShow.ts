import mongoose, { model, Schema } from "mongoose";
import { TvShow } from "../types";
import { videoModel } from "./Video";

const schemaTvShow = new Schema<TvShow>(
  {
    idMovieDb: String, // id
    name: String,
    location: String,
    numberSeason: Number, // number_of_episodes
    numberEpisode: Number, // number_of_seasons
    seasons: [
      {
        number: String,
        episodes: [
          {
            number: String,
            ref: {
              type: Schema.Types.ObjectId,
              ref: videoModel
            }
          }
        ],
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

export const tvShowModel = model<TvShow>("season", schemaTvShow);

export default schemaTvShow;
