import { TTvShow } from "../../types"
import baseDTO from "../../utils/BaseDTO";
import { Video } from "../Video/Video.entity";
import { WatchedTvShow } from "../WatchedTvShow/WatchedTvShow.entity";


export class TvShowDTO extends baseDTO<TTvShow>{
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
  userWatchedTvShow?: WatchedTvShow[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: TTvShow) {
    super();
    for (let el in data) {
      this[el] = data[el]
    }
  }
}