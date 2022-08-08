import { TMovieDbJob } from "../../types";
import baseDTO from "../../utils/BaseDTO";

export class MovieDbJobDTO extends baseDTO<TMovieDbJob> {
  id: number;

  constructor(data: TMovieDbJob) {
    super();
    for (let el in data) {
      this[el] = data[el];
    }
  }
}
