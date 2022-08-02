import Ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import { readFile, readFileSync } from "fs";
import { open } from "fs/promises";
import path from "path";
import { basePath } from "../../config/defaultConfig";
import { logger } from "../../libs/logger";
import { go } from "../../services/miscelleneaous";
import { promisifier } from "../../services/promisifier";
import { regExBasename, regexTvShow, regexVideo } from "../../utils/regexes";
import { TvShowDTO } from "../TvShow/TvShow.dto";
import TvShowService from "../TvShow/TvShow.service";
import { VideoDTO } from "../Video/Video.dto";
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

    const entries = await this.addEntries(result);

    return { data: result, total: result.length };
  }

  async addEntries(list: path.ParsedPath[]) {
    const result: { videos: VideoDTO[]; tvShows: TvShowDTO[] } = {
      videos: [],
      tvShows: [],
    };

    for (const el of list) {
      const data = await this.addEntry(el);
      // result.videos.push(data.video)
      // if (data.tvShow) {
      //   result.tvShows.push(data.tvShow)
      // }
    }
  }

  async addEntry(
    el: path.ParsedPath
  ): Promise<{ video: VideoDTO; tvShow?: TvShowDTO }> {
    const isTvShow = el.name.match(regexTvShow);
    let tvShow: TvShowDTO;

    if (isTvShow) {
      const index = el.name.split("/").findIndex(el => el === this.pathVideos);
      const name = el.name.split("/")[index + 1];
      const [result, error] = await this.tvShowSer.findByName(name);

      if (error) {
        logger.error(error);
      }

      if (!Object.keys(result).length) {
        const [result, error] = await this.tvShowSer.create({
          name,
          location: el.dir,
        });
        if (error) {
          logger.error(error);
        }
        tvShow = result;
        logger.info("tv Show created");
      } else {
        tvShow = result;
        logger.info("tv show found");
      }
    }

    return;
  }
}
