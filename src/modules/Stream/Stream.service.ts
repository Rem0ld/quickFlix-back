import { MissingDataPayloadException, err, ok } from "../../services/Error";
import { Result } from "../../types";
import { VideoDTO } from "../Video/Video.dto";
import VideoService from "../Video/Video.service";

export default class StreamService {
  constructor(private vs: VideoService) {}

  async findVideo(id: string): Promise<Result<VideoDTO, Error>> {
    if (!id.length) {
      return err(new MissingDataPayloadException("id"));
    }

    const [result, error] = await this.vs.findByUuid(id);
    console.log(
      "🚀 ~ file: Stream.service.ts ~ line 15 ~ StreamService ~ findVideo ~ result",
      result
    );
    if (error) {
      return err(error);
    }

    return ok(result);
  }
}
