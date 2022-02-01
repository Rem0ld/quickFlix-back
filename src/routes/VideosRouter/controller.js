import { videoModel } from "../../schemas/Video";
import { defaultLimit } from "../../config/defaultConfig";
import VideoService from "./service";

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

  async find(req, res, next) {
    const { limit = defaultLimit, skip = 0, movie = false } = req.query;
    const request = {};

    if (movie) {
      request.type = "movie";
    }

    if (+limit === -1) {
      const data = await videoModel.find(request);
      res.json(data);
      return;
    }

    try {
      const count = await videoModel.countDocuments();
      const data = await videoModel
        .find(request)
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

    try {
      const video = await videoModel.findById(id);

      if (!video) {
        throw new Error("Video doesn't exists");
      }

      res.json(video);
    } catch (error) {
      next(error);
    }
  }

  async findOneByName(req, res, next) {
    const { name } = req.body;

    if (!name) next(new Error("missing name"));

    try {
      const re = new RegExp(`${name}`, "i");

      const video = await videoModel.find({ name: re });

      if (!video) throw new Error("Movie doesn't exists");

      res.json(video);
    } catch (error) {
      next(error);
    }
  }

  async findByFields(req, res, next) {
    try {
      const result = await VideoService.findByFields(req.body);

      if (!result) throw new Error("Internal Server Error");

      res.json(result);
    } catch (error) {
      next(error);
    }
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
      next(new Error("Internal Server Error"));
    }

    res.json(video);
  }

  async deleteAll(req, res) {
    const videos = await videoModel.deleteMany();

    res.json(`${videos.deletedCount} removed`);
  }
}
