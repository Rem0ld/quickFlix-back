import { TWatched } from "../../types";
import baseDTO from "../../utils/BaseDTO";
import { User } from "../User/User.entity";
import { Video } from "../Video/Video.entity";
import { WatchedTvShow } from "../WatchedTvShow/WatchedTvShow.entity";

export class WatchedDTO extends baseDTO<TWatched> {
  id: number;
  timesWatched: number;
  finished: boolean;
  video: Video;
  user: User;
  userWatchedTvShow: WatchedTvShow[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: TWatched) {
    super();
    for (let el in data) {
      this[el] = data[el]
    }
  }
}