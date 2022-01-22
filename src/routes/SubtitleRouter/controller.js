import { subtitleModel } from "../../schemas/Subtitles";
import { defaultLimit } from "../../config/defaultConfig";

export default class SubtitleController {
  async find(req, res, next) {
    const { limit = defaultLimit, skip = 0 } = req.query;

    if (+limit === -1) {
      const subtitles = await subtitleModel.find();
      res.json(subtitles);
      return;
    }

    try {
      const count = await subtitleModel.countDocuments();
      const data = await subtitleModel
        .find()
        .skip(+skip)
        .limit(+limit);

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
    const subtitle = await subtitleModel.findById(id);

    if (!subtitle) {
      next(new Error("Subtitle doesnt exists"));
    }

    res.json(subtitle);
  }

  async create(req, res, next) {}
  async patch(req, res, next) {}
  async delete(req, res, next) {}
  async deleteAll(_, res) {
    const subtitles = await subtitleModel.deleteMany();

    res.json(`${subtitles.deletedCount} removed`);
  }
}
