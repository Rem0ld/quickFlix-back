import { movieDbJobModel } from "../../schemas/MovieDbJob";
import { tvShowModel } from "../../schemas/TvShow";
import { videoModel } from "../../schemas/Video";
import { watchedModel } from "../../schemas/Watched";
import { watchedTvShowModel } from "../../schemas/WatchedTvShow";
import { RequestBuilder, Video, Watched, WatchedTvShow } from "../../types";
import { movieJobService } from "../MovieDbJob/MovieDbJob.service";


class WatchedService {
  async create(data: Partial<Watched>) {
    return watchedModel.create(data)
  }

  async update(id: string, data: Partial<Watched>) {
    return watchedModel.findOneAndUpdate({ video: id }, data)
  }

  async findByVideoId(id: string) {
    return watchedModel.findOne({ video: id })
  }
}

export default new WatchedService();
