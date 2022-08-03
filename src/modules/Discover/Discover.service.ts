import Ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import { readFile, readFileSync } from "fs";
import { open } from "fs/promises";
import path from "path";
import { basePath } from "../../config/defaultConfig";
import { logger } from "../../libs/logger";
import { err, ok } from "../../services/Error";
import { go } from "../../services/miscelleneaous";
import { promisifier } from "../../services/promisifier";
import { Result } from "../../types";
import { regExBasename, regexTvShow, regexVideo } from "../../utils/regexes";
import { parseBasename } from "../../utils/stringManipulation";
import { TvShowDTO } from "../TvShow/TvShow.dto";
import TvShowService from "../TvShow/TvShow.service";
import { VideoDTO } from "../Video/Video.dto";
import { VideoTypeEnum } from "../Video/Video.entity";
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

    return { data: entries, total: entries.length };
  }

  async addEntries(list: path.ParsedPath[]) {
    const result: VideoDTO[] = [];

    for (const el of list) {
      const isTvShow = el.name.match(regexTvShow);
      let tvShow: TvShowDTO;
      if (isTvShow) {
        const [result, error] = await this.findOrCreateTvShow(el);
        if (error) {
          logger.error(error);
          // return err(error);
        }
        tvShow = result;
      }

      const [data, error] = await this.addEntry(el, tvShow);
      if (error) {
        logger.error(error);
      }
      result.push(data);
    }

    return result;
  }

  async findOrCreateTvShow(
    el: path.ParsedPath
  ): Promise<Result<TvShowDTO, Error>> {
    const splitDir = el.dir.split(path.sep);
    const name = splitDir.find((_, i, arr) => arr[i - 1] === this.pathVideos);

    let [result, error] = await this.tvShowSer.findByName(name);
    if (error) {
      return err(error);
    }

    if (Object.keys(result).length) {
      return ok(result);
    }

    const i = splitDir.findIndex(el => el === this.pathVideos);
    const pathDir = splitDir.slice(0, i + 2).join("/");
    [result, error] = await this.tvShowSer.create({
      name,
      location: pathDir,
    });
    if (error) {
      return err(error);
    }
    return ok(result);
  }

  async addEntry(
    el: path.ParsedPath,
    tvShow: TvShowDTO | undefined
  ): Promise<Result<VideoDTO, Error>> {
    const [result, error] = await this.videoSer.findByFields({ name: el.name });
    if (error) {
      return err(error);
    }
    if (result.data.length) {
      return ok(result.data[0]);
    }

    const splitDir = el.dir.split(path.sep);
    const name = splitDir.find((_, i, arr) => arr[i - 1] === this.pathVideos);
    const [data, error2] = await this.videoSer.create({
      name: el.name,
      basename: name ? name.toLowerCase() : el.name,
      filename: el.name,
      location: el.dir,
      ext: el.ext,
      tvShow: tvShow,
      type: tvShow ? VideoTypeEnum.TV : VideoTypeEnum.MOVIE,
    });
    if (error2) {
      return err(error2);
    }

    return ok(data);
  }
}
