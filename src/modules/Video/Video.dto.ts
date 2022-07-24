import { TVideo, TWatched } from "../../types";
import baseDTO from "../../utils/BaseDTO";
import { TvShow } from "../TvShow/TvShow.entity";
import { Watched } from "../Watched/Watched.entity";
import { Video, VideoTypeEnum } from "./Video.entity";

export class VideoDTO extends baseDTO<TVideo> {
  // id: number;
  // uuid: string;
  // name: string;
  // basename: string;
  // filename: string;
  // ext: string;
  // location: string;
  // episode: number;
  // season: number;
  // year: Date;
  // releaseDate: Date;
  // type: VideoTypeEnum;
  // score: number;
  // resume?: string;
  // length?: number;
  // idMovieDb: string;
  // directors?: string[];
  // writers?: string[];
  // actors?: string[];
  // genres: string[];
  // trailerYtCode: string[];
  // posterPath: string[];
  // video?: Video;
  // tvShow?: TvShow;
  // userWatchedVideo?: Watched[];
  // createdAt: Date;
  // updatedAt: Date;

  constructor(data: TVideo) {
    super();
    for (let el in data) {
      this[el] = data[el];
    }
  }
}
