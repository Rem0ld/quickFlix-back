import mongoose, { model, Schema, Types } from "mongoose";
import { EncodingJob, EnumStatus } from "../types";

import { videoModel } from "./Video";

const schemaEncodingJobs = new Schema<EncodingJob>({
  videoId: { type: Schema.Types.ObjectId, ref: videoModel },
  pathname: { type: String },
  status: { type: String, enum: ["todo", "done", "error"], default: "todo", index: true },
  error: [String],
  type: { type: String, enum: ["audio", "video"], index: true },
});

export const encodingJobModel = model<EncodingJob>("encodingJobs", schemaEncodingJobs);
export default schemaEncodingJobs;
