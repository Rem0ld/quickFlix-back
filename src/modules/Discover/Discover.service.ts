import { readFile, readFileSync } from "fs";
import { open } from "fs/promises";
import path from "path";
import { basePath } from "../../config/defaultConfig";
import { go } from "../../services/miscelleneaous";
import { regexTvShow, regexVideo } from "../../utils/regexes";
import TvShowService from "../TvShow/TvShow.service";
import VideoService from "../Video/Video.service";

export default class DiscoverService {
  videoSer: VideoService;
  tvShowSer: TvShowService;
  pathVideos: string;
  pathTvShows: string;
  tempFile: string;
  regVideo: RegExp = regexVideo;
  regTvShow: RegExp = regexTvShow;
  constructor(vs: VideoService, ts: TvShowService) {
    this.videoSer = vs;
    this.tvShowSer = ts;
    this.pathVideos =
      process.env.NODE_ENV === "development" ? "videos" : "Videos";
    this.pathTvShows = process.env.NODE_ENV === "development" ? null : "Series";
    this.tempFile = basePath + path.sep + "temp";
  }

  async findInDirectory() {
    const result = await go(
      basePath + path.sep + this.pathVideos,
      this.tempFile,
      this.regVideo,
      []
    );

    return { data: result, total: result.length }
  }
}
