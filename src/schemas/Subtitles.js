import { Schema } from "mongoose";

const Subtitles = new Schema({
  name: String,
  ext: String,
  path: String
})

export default Subtitles