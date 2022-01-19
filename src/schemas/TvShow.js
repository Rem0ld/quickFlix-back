import mongoose, { model, Schema } from "mongoose"
import { videoModel } from "./Video"

const schemaTvShow = new Schema(
  {
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
    resume: String,
    score: Number,
    date: Date,
  },
  {
    timestamps: true,
  }
)

export const tvShowModel = model("season", schemaTvShow)

export default schemaTvShow
