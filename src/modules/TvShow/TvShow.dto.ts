import { TvShow } from "./TvShow.entity";
import { TTvShow } from "../../types"
import baseDTO from "../../utils/BaseDTO";


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
  createdAt: Date;
  updatedAt: Date;

  constructor(data: TTvShow) {
    super();
    for (let el in data) {
      this[el] = data[el]
    }
  }
}