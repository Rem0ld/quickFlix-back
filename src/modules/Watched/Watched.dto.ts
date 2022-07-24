import { TWatched } from "../../types";
import baseDTO from "../../utils/BaseDTO";

export class WatchedDTO extends baseDTO<TWatched> {
  constructor(data: TWatched) {
    super();
    for (let el in data) {
      this[el] = data[el]
    }
  }
}