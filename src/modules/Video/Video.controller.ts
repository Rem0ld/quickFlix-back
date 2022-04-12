import { defaultLimit } from "../../config/defaultConfig";
import { Request, Response, NextFunction } from 'express';
import { Controller, Middleware, ErrorMiddleware, Get, Post, Put, Patch, Delete, ClassErrorMiddleware } from "@overnightjs/core"
import errorHandler from "../../services/errorHandler";
import VideoService from "./Video.service";
import { RequestBuilder, TvShow, Video } from "../../types";
import { videoModel } from "../../schemas/Video";
import { watchedModel } from "../../schemas/Watched";
import { Mongoose, Types } from "mongoose";
import path from "path";

const aggregateWithWatched = async (list: Video[]) => {
  const watched = await videoModel.aggregate([
    {
      '$match': {
        '_id': {
          '$in': list.map(el => new Types.ObjectId(el._id))
        }
      }
    }, {
      '$lookup': {
        'from': 'watcheds',
        'localField': '_id',
        'foreignField': 'video',
        'as': 'watched'
      }
    }, {
      '$unwind': {
        'path': '$watched',
        'preserveNullAndEmptyArrays': true
      }
    }
  ])

  return watched
}

@Controller("video")
@ClassErrorMiddleware(errorHandler)
export default class VideoController {
  @Get()
  private async find(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { limit = defaultLimit, skip = 0, movie = false } = req.query;
    const request: RequestBuilder = {
      type: ["tv", "movie"]
    };

    if (movie) {
      request.type = ["movie"];
    }

    if (+limit === -1) {
      const data = await videoModel.find(request);
      res.json(data);
      return;
    }

    try {
      const count = await videoModel.countDocuments(request);
      const data = await videoModel
        .find(request)
        .skip(+skip)
        .limit(+limit);


      res.json({
        total: count,
        limit: +limit,
        skip: +skip,
        data: await aggregateWithWatched(data),
      });
    } catch (error) {
      next(error);
    } finally {
      return;
    }
  }

  @Get(":id")
  private async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;

    if (!id) {
      next(new Error("Missing ID"))
    }

    try {
      const video = await videoModel.findById(id);

      if (!video) {
        throw new Error("Video doesn't exists");
      }

      res.json(video);
    } catch (error) {
      next(error);
    } finally {
      return;
    }
  }

  @Post("reset")
  private async resetLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
    const videos = await videoModel.find({});

    const promises = videos.map(video => {
      const basename = path.basename(video.filename)
      const splitted = basename.split(",")
      const filename = splitted.slice(0, splitted.length - 2).join(".")
      return videoModel.findByIdAndUpdate(video._id, {
        location: path.dirname(video.location),
        filename: `${filename}${video.ext}`
      })
    })

    Promise.allSettled(promises).then(result => res.json(result))
  }

  @Post("by-name")
  private async findOneByName(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name } = req.body;

    if (!name) next(new Error("missing name"));

    try {
      const re = new RegExp(`${name}`, "i");

      const video = await videoModel.find({ name: re });

      if (!video) throw new Error("Movie doesn't exists");

      res.json(video);
    } catch (error) {
      next(error);
    } finally {
      return;
    }
  }

  @Post("by-fields")
  private async findOneByFields(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await VideoService.findByFields(req.body);

      if (!result) throw new Error("Internal Server Error");

      res.json(result);
    } catch (error) {
      next(error);
    } finally {
      return;
    }
  }

  @Post()
  private async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.body.name) {
      next(new Error("missing name"));
    }

    try {
      const video = await VideoService.create(req.body, { movieJob: true });

      res.json({
        video,
      });
    } catch (error) {
      next(error)
    } finally {
      return;
    }
  }

  @Patch(":id")
  private async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params

    if (!id) next(new Error("Missind ID"));

    videoModel.findOneAndUpdate({ _id: id }, { ...req.body }).then(result => {
      res.json(result)
    }).catch(err => {
      next(err)
    }).finally(() => { return })

  }

  @Delete(":id")
  private async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;

    if (!id) {
      next(new Error("Missing ID"));
    }

    const video = await VideoService.deleteOneById(id);

    if (!video) {
      next(new Error("Internal Server Error"));
    }

    if (video === -1) {
      res.json(`No entry for this ${id}`)
    }

    res.json(video);
    return;
  }

  // TODO: middleware to check if admin
  @Delete()
  private async deleteAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    // See function signature
    const result = await VideoService.deleteAll();

    res.json(result);
  }
}
