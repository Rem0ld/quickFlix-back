import { TUser } from "../../types";
import baseDTO from "../../utils/BaseDTO";
import { Watched } from "../Watched/Watched.entity";
import { WatchedTvShow } from "../WatchedTvShow/WatchedTvShow.entity";

export class UserDTO extends baseDTO<TUser> {
  id: number;
  pseudo: string;
  email: string;
  password: string;
  isAdmin: boolean;
  userWatchedVideo?: Watched[];
  userWatchedTvShow?: WatchedTvShow[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: TUser) {
    super();
    for (const el in data) {
      if (data[el] !== null) {
        this[el] = data[el];
      }
    }
  }

  protectPassword() {
    delete this.password;
    return this;
  }
}
