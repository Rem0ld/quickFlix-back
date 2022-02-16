import { model, Schema } from "mongoose";
import { Subtitle } from "../types";

const schemaSubtitle = new Schema<Subtitle>(
  {
    name: String,
    ext: String,
    path: String,
  },
  {
    timestamps: true,
  }
);

export const subtitleModel = model<Subtitle>("subtitle", schemaSubtitle);

export default schemaSubtitle;
