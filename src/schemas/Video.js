import { Schema } from "mongoose"

const Video = new Schema({
  name: String,
  baseName: String,
  type: String,
  date: Date,
  score: Number,
  length: Date,
  resume: String,
  director: String,
  writers: String,
  stars: String,
  location: String,
  trailer: String,
  subtitles: [String],
})

export default Video
