import { TWatchedTvShow } from "../../types";
import baseDTO from "../../utils/BaseDTO";

export class WatchedTvShowDTO extends baseDTO<TWatchedTvShow> {
  constructor(data: TWatchedTvShow) {
    super();
    for (let el in data) {
      this[el] = data[el];
    }
  }
}
