import Ffmpeg, { FfmpegCommand, FfprobeData } from "fluent-ffmpeg";
import VideoService from "../Video/Video.service";
import { err, MissingDataPayloadException, ok } from "../../services/Error";
import { promisifier } from "../../services/promisifier";
import { Result } from "../../types";

export default class FfmpegWorkerService {
  private MAX_WORKER = 1;
  private currentWorkerNum = 0;
  constructor(private command: FfmpegCommand, private vs: VideoService) {}

  private get getCurrentWorkerNum() {
    return this.currentWorkerNum;
  }

  private decrement() {
    this.currentWorkerNum = this.getCurrentWorkerNum - 1;
  }

  private increment() {
    this.currentWorkerNum = this.getCurrentWorkerNum + 1;
  }

  async getInfoVideoWithUuid(
    uuid: string
  ): Promise<Result<FfprobeData, Error>> {
    if (!uuid) {
      return err(new MissingDataPayloadException("uuid"));
    }
    const [location, error] = await this.vs.getPath(uuid);
    if (error) {
      return err(error);
    }
    return this.getInfo(location);
  }

  async getInfoVideoWithPathname(
    pathname: string
  ): Promise<Result<FfprobeData, Error>> {
    if (!pathname) {
      return err(new MissingDataPayloadException("pathname"));
    }

    return this.getInfo(pathname);
  }

  async getInfo(pathname: string): Promise<Result<FfprobeData, Error>> {
    const [result, errFfmpeg] = await promisifier<FfprobeData>(
      new Promise((resolve, reject) =>
        this.command.input(pathname).ffprobe((err: any, data: FfprobeData) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        })
      )
    );
    if (errFfmpeg) {
      return err(new Error());
    }

    return ok(result);
  }
}
