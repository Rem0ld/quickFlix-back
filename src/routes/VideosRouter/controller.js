import { videoModel } from "../../schemas/Video";
import { defaultLimit } from "../../config/defaultConfig";

export default class VideoController {
  async create(req, res, next) {
    const {
      name,
      type = "movie",
      date,
      length = 0,
      score = 0,
      resume = "",
      director = "",
      writers = "",
      stars = "",
      location = "",
      trailer = "",
      ext,
    } = req.body;

    if (!name) {
      next(new Error("missing name"));
    }
    const video = await videoModel.create({
      name,
      type,
      length,
      date,
      score,
      resume,
      director,
      writers,
      stars,
      ext,
      location,
      trailer,
    });

    res.json({
      video,
    });
  }

  async find(req, res) {
    const { limit = defaultLimit, skip = 0 } = req.query;
    let count = await videoModel.countDocuments();

    if (+limit === -1) res.json(await videoModel.find());

    const data = await videoModel
      .find()
      .skip(+skip)
      .limit(+limit);

    res.json({
      total: count,
      limit: +limit,
      skip: +skip,
      data,
    });
  }

  async findById(req, res, next) {
    const { id } = req.params;
    const video = await videoModel.findById(id);

    if (!video) {
      next(new Error("Movie doesnt exists"));
    }

    res.json(video);
  }

  async findOneByName(req, res, next) {
    const { name } = req.body;

    if (!name) next(new Error("Please enter a name"));

    const video = await videoModel.findOne({ name });

    if (!video) next(new Error("Movie doesn't exists"));

    res.json(video);
  }

  async update(req, res, next) {
    await videoModel.updateOne(req.body, (err, result) => {
      if (err) {
        next(err);
      }
      res.json(result);
    });
  }

  async delete(req, res, next) {
    const { _id } = req.body;
    const video = await videoModel.findByIdAndDelete(_id);

    if (!video) {
      next(new Error("Couldnt remove movie"));
    }

    res.json(video);
  }

  async deleteAll(req, res, next) {
    const videos = await videoModel.deleteMany();

    res.json(`${videos.deletedCount} removed`);
  }
}
