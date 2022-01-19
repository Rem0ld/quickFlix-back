import { model, Schema } from "mongoose"

const schemaSubtitle = new Schema(
  {
    name: String,
    ext: String,
    path: String,
  },
  {
    timestamps: true,
  }
)

export const subtitleModel = model("subtitle", schemaSubtitle)

export default schemaSubtitle
