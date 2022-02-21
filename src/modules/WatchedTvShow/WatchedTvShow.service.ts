import { movieDbJobModel } from "../../schemas/MovieDbJob";
import { tvShowModel } from "../../schemas/TvShow";
import { videoModel } from "../../schemas/Video";
import { watchedModel } from "../../schemas/Watched";
import { watchedTvShowModel } from "../../schemas/WatchedTvShow";
import { RequestBuilder, Video, Watched, WatchedTvShow } from "../../types";
import { movieJobService } from "../MovieDbJob/MovieDbJob.service";


class WatchedTvShowService {
  async create(data: Partial<WatchedTvShow>) {
    return watchedTvShowModel.create(data)
  }

  async update(name: string, data: Pick<Video, "_id">) {
    const tvShow = await watchedTvShowModel.findOne({ tvShow: name })

    if (!tvShow) {
      console.log("does not exist yet, creation watchedtvshow")
      return this.create({
        tvShow: name,
        videos: [data._id]
      })
    }

    const exists = tvShow?.videos.findIndex(video => {
      video === data._id
    })

    if (!exists) {
      return watchedTvShowModel.updateOne({ tvShow: name }, {
        videos: [...tvShow.videos, ...data._id]
      })

    }

    return undefined
  }

  async findTvShow(id: string) {
    return watchedTvShowModel.findOne(({ tvShow: id })).populate({ path: "videos" })
  }

}

export default new WatchedTvShowService();
