import { TWatchedTvShow } from "../../types";
import baseDTO from "../../utils/BaseDTO";
import { TvShow } from "../TvShow/TvShow.entity";
import { User } from "../User/User.entity";
import { Watched } from "../Watched/Watched.entity";

export class WatchedTvShowDTO extends baseDTO<TWatchedTvShow> {
  id: number;
  watched: Watched;
  tvShow: TvShow;
  user: User;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: TWatchedTvShow) {
    super();
    for (let el in data) {
      this[el] = data[el];
    }
  }
}