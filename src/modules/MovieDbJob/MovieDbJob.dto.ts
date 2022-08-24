import { TMovieDbJob } from "../../types";
import baseDTO from "../../utils/BaseDTO";
import { jobStatusType } from "../EncodingJob/EncodingJob.entity";
import { TvShow } from "../TvShow/TvShow.entity";
import { Video, VideoTypeEnum } from "../Video/Video.entity";

export class MovieDbJobDTO extends baseDTO<TMovieDbJob> {
  id: number;
  status: jobStatusType;
  errors?: string[];
  type: VideoTypeEnum;
  video?: Video;
  tvShow?: TvShow;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: TMovieDbJob) {
    super();
    for (const el in data) {
      if (data[el] !== null) {
        this[el] = data[el];
      }
    }
  }
}
