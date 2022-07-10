import { TWatched } from "../../types";


class WatchedService {
  async create(data: Partial<TWatched>) {
    return watchedModel.findOneAndUpdate({ video: data.video }, data, { upsert: true })
  }

  async update(id: string, data: Partial<TWatched>) {
    return watchedModel.findOneAndUpdate({ video: id }, data, { upsert: true }).then((result) => {
      return result
    })
  }

  async findByVideoId(id: string) {
    return watchedModel.findOne({ video: id })
  }
}

export default new WatchedService();
