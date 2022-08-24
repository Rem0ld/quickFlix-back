import { TTvShow, TVideoSorted } from "../../types";
import baseDTO from "../../utils/BaseDTO";
import { MovieDbJob } from "../MovieDbJob/MovieDbJob.entity";
import { VideoDTO } from "../Video/Video.dto";
import { Video } from "../Video/Video.entity";
import { WatchedTvShow } from "../WatchedTvShow/WatchedTvShow.entity";

export class TvShowDTO extends baseDTO<TTvShow> {
  id: number;
  idMovieDb?: string;
  name: string;
  location: string;
  numberEpisode: number;
  numberSeason: number;
  ongoing: boolean;
  originCountry: string[];
  score: number;
  resume?: string;
  averageLength?: number;
  genres: string[];
  trailerYtCode: string[];
  posterPath: string[];
  firstAirDate: Date;
  videos?: Video[];
  movieDbJob?: MovieDbJob;
  userWatchedTvShow?: WatchedTvShow[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: TTvShow) {
    super();
    for (const el in data) {
      if (data[el] !== null) {
        this[el] = data[el];
      }
    }
  }
}
