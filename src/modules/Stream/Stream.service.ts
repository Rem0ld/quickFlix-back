import path from "path";
import { MissingDataPayloadException, err, ok } from "../../services/Error";
import { Result } from "../../types";
import { VideoDTO } from "../Video/Video.dto";
import VideoService from "../Video/Video.service";

export default class StreamService {
  constructor(private vs: VideoService) { }

  async findVideo(id: string): Promise<Result<VideoDTO, Error>> {
    if (!id.length) {
      return err(new MissingDataPayloadException("id"));
    }

    const [result, error] = await this.vs.findById(id);
    if (error) {
      return err(error);
    }

    ok(result);
  }
}
