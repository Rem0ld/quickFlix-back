import { watchedModel } from "../../schemas/Watched";
import { Watched } from "../../types";


class WatchedService {
  async create(data: Partial<Watched>) {
    return watchedModel.findOneAndUpdate({ video: data.video }, data, { upsert: true })
  }

  async update(id: string, data: Partial<Watched>) {
    return watchedModel.findOneAndUpdate({ video: id }, data).then((result) => {
      return result
    })
  }

  async findByVideoId(id: string) {
    return watchedModel.findOne({ video: id })
  }
}

export default new WatchedService();
