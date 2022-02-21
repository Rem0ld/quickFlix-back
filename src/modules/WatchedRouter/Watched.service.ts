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

  async createTvShow(data: Partial<WatchedTvShow>) {
    return watchedTvShowModel.create(data)
  }

  async update(id: string, data: Partial<Watched>) {
    return watchedModel.findOneAndUpdate({ video: id }, data)
  }

  async updateTvShow(id: string, data: Pick<Video, "_id">) {
    const tvShow = await watchedTvShowModel.findOne({ tvShow: id })

    const exists = tvShow?.videos.indexOf
    return watchedTvShowModel.updateOne({ tvShow: id }, data)
  }

  async findByVideoId(id: string) {
    return watchedModel.findOne({ video: id })
  }

  async findTvShow(id: string) {
    return watchedTvShowModel.findOne(({ tvShow: id })).populate({ path: "videos" })
  }

}

export default new WatchedService();
