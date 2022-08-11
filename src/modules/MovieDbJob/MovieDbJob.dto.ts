import { TMovieDbJob } from "../../types";
import baseDTO from "../../utils/BaseDTO";
import { jobStatusType } from "../EncodingJob/EncodingJob.entity";
import { Video, VideoTypeEnum } from "../Video/Video.entity";

export class MovieDbJobDTO extends baseDTO<TMovieDbJob> {
  id: number;
  status: jobStatusType;
  errors: string;
  type: VideoTypeEnum;
  videoId?: number;
  tvShowId?: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: TMovieDbJob) {
    super();
    for (let el in data) {
      this[el] = data[el];
    }
  }
}
