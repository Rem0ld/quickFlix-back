import { tvShowModel } from "../../schemas/TvShow"

export default class TvShowController {
  async create(req, res, next) {}
  async find(req, res, next) {
    const tvshows = await tvShowModel.find()

    res.json(tvshows)
  }
  async get(req, res, next) {}
  async patch(req, res, next) {}
  async delete(req, res, next) {}
  async deleteAll(req, res, next) {
    const tvShows = await tvShowModel.deleteMany()

    res.json(`${tvShows.deletedCount} removed`)
  }
}
