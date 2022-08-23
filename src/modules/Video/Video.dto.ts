import { Video } from "./Video.entity";
import { TVideo, TWatched } from "../../types";
import baseDTO from "../../utils/BaseDTO";
import { TvShow } from "../TvShow/TvShow.entity";
import { Watched } from "../Watched/Watched.entity";
import { VideoTypeEnum } from "./Video.entity";
import { MovieDbJob } from "../MovieDbJob/MovieDbJob.entity";

export class VideoDTO extends baseDTO<TVideo> {
  id: number;
  uuid: string;
  name: string;
  basename: string;
  filename: string;
  ext: string;
  location: string;
  episode: number;
  season: number;
  year: Date;
  releaseDate: Date;
  type: VideoTypeEnum;
  score: number;
  resume?: string;
  length?: number;
  idMovieDb: string;
  directors?: string[];
  writers?: string[];
  actors?: string[];
  genres: string[];
  trailerYtCode: string[];
  posterPath: string[];
  video?: Video;
  tvShow?: TvShow;
  movieDbJob?: MovieDbJob;
  userWatchedVideo?: Watched[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: TVideo) {
    super();
    for (const el in data) {
      this[el] = data[el];
    }
  }
}
