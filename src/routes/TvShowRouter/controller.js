import { tvShowModel } from "../../schemas/TvShow"
import { defaultLimit } from "../../config/defaultConfig"

export default class TvShowController {
  async create(req, res, next) {}
  async find(req, res, next) {
    const { limit = defaultLimit, skip = 0 } = req.query
    const count = await tvShowModel.countDocuments()

    if (+limit === -1) res.json(await tvShowModel.find())

    const data = await tvShowModel
      .find()
      .skip(+skip)
      .limit(+limit)

    res.json({
      total: count,
      limit: +limit,
      skip: +skip,
      data,
    })
  }

  async findById(req, res, next) {
    const { id } = req.params
    const tvShow = await tvShowModel.findById(id)

    if (!tvShow) {
      next(new Error("TvShow doesnt exists"))
    }

    res.json(tvShow)
  }

  async findOneByName(req, res, next) {
    const { name } = req.body

    if (!name) next(new Error("Please enter a name"))

    const tvShow = await tvShowModel.findOne({ name })

    if (!tvShow) next(new Error("TvShow doesn't exists"))

    res.json(tvShow)
  }

  async patch(req, res, next) {}
  async delete(req, res, next) {}
  async deleteAll(req, res, next) {
    const tvShows = await tvShowModel.deleteMany()

    res.json(`${tvShows.deletedCount} removed`)
  }
}
