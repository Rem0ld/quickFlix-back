import { movieDbJobModel } from "../../schemas/MovieDbJob";
import movieDbJobService from "./service";
import { defaultLimit } from "../../config/defaultConfig";

export default class MovieDbJobController {
  async find(req, res, next) {
    const { limit = defaultLimit, skip = 0, populate = false } = req.query;

    if (+limit === -1) {
      const data = await movieDbJobModel.find();
      res.json(data);
      return;
    }

    try {
      const count = await movieDbJobModel.countDocuments();
      const data = await movieDbJobService.find({
        limit,
        skip,
        populate,
      });

      res.json({
        total: count,
        limit: +limit,
        skip: +skip,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async findById(req, res, next) {
    const { id } = req.params;

    if (!id) next(new Error("Requires an id"));

    return movieDbJobService.findById(id);
  }

  async findByVideoId(req, res, next) {
    const { id } = req.body;

    if (!id) next(new Error("Requires an id"));

    return movieDbJobService.findByVideoId(id);
  }
}
