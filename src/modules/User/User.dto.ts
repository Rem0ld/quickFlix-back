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
    for (let el in data) {
      this[el] = data[el];
    }
  }

  protectPassword() {
    const obj = Object.assign({}, this)
    delete obj.password
    return obj;
  }
}