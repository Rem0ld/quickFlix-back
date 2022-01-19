import { model, Schema } from "mongoose"
import { videoModel } from "./Video"

const schemaSeason = new Schema(
  {
    count: Number,
    numberEpisode: Number,
    tvShow: { ref: videoModel },
    ongoing: Boolean,
  },
  {
    timestamps: true,
  }
)

export const seasonModel = model("season", schemaSeason)

export default schemaSeason
