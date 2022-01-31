import { tvShowModel } from "../../schemas/TvShow";
import { defaultLimit } from "../../config/defaultConfig";

export default class TvShowController {
  async create(req, res, next) {}
  async find(req, res, next) {
    const { limit = defaultLimit, skip = 0, populate = false } = req.query;

    if (+limit === -1) {
      let data;

      if (populate) {
        data = await tvShowModel.find().populate({
          path: "seasons",
          populate: {
            path: "episodes",
            populate: {
              path: "ref",
            },
          },
        });
      } else {
        data = await tvShowModel.find();
      }

      if (!data) throw new Error("Internal Server Error");

      res.json(data);
      return;
    }

    try {
      const count = await tvShowModel.countDocuments();
      let data;

      if (populate) {
        data = await tvShowModel
          .find()
          .skip(+skip)
          .limit(+limit)
          .populate({
            path: "seasons",
            populate: {
              path: "episodes",
              populate: {
                path: "ref",
              },
            },
          });
      } else {
        data = await tvShowModel
          .find()
          .skip(+skip)
          .limit(+limit);
      }

      if (!data) throw new Error("Internal Server Error");

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
    const tvShow = await tvShowModel.findById(id);

    if (!tvShow) {
      next(new Error("TvShow doesnt exists"));
    }

    res.json(tvShow);
  }

  async findOneByName(req, res, next) {
    const { name } = req.body;

    if (!name) next(new Error("missing name"));

    const tvShow = await tvShowModel.findOne({ name });

    if (!tvShow) next(new Error("TvShow doesn't exists"));

    res.json(tvShow);
  }

  async patch(req, res, next) {}
  async delete(req, res, next) {}
  async deleteAll(req, res, next) {
    const tvShows = await tvShowModel.deleteMany();

    res.json(`${tvShows.deletedCount} removed`);
  }
}
