import { MissingDataPayloadException, err, ok } from "../../services/Error";
import { Result } from "../../types";
import { UserDTO } from "../User/User.dto";
import { VideoDTO } from "../Video/Video.dto";
import VideoService from "../Video/Video.service";

export default class StreamService {
  constructor(private vs: VideoService) {}

  async findVideo(id: string, user?: string): Promise<Result<VideoDTO, Error>> {
    if (!id.length) {
      return err(new MissingDataPayloadException("id"));
    }

    const [result, error] = await this.vs.findByUuid(id, user);
    if (error) {
      return err(error);
    }

    return ok(result);
  }
}
