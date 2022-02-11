import { videoModel } from "../../schemas/Video";
import { defaultLimit } from "../../config/defaultConfig";
import VideoService from "./service";

export default class VideoController {
  async create(req, res, next) {
    if (!req.body.name) {
      next(new Error("missing name"));
    }

    const video = await VideoService.create(req.body, { movieJob: true });

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
    const video = await VideoService.deleteOneById(_id);

    if (!video) {
      next(new Error("Internal Server Error"));
    }

    res.json(video);
  }

  async deleteAll(req, res) {
    const result = await VideoService.deleteAll();

    res.json(`${result} removed`);
  }
}
