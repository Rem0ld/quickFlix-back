import { defaultLimit } from "../../config/defaultConfig";
import { Request, Response, NextFunction } from 'express';
import { Controller, Middleware, ErrorMiddleware, Get, Post, Put, Delete, ClassErrorMiddleware, Patch } from "@overnightjs/core"
import errorHandler from "../../services/errorHandler";
import { TVideo } from "../../types";
import MovieDbJobService from "./MovieDbJob.service";

@Controller("movie-job")
@ClassErrorMiddleware(errorHandler)
export default class MovieDbJobController {
  constructor(private service: MovieDbJobService) { }

  @Get()
  async find(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { limit = defaultLimit, skip = 0 } = req.query;

    const [result, error] = await this.service.find(+limit, +skip)
    console.log("🚀 ~ file: MovieDbJob.controller.ts ~ line 18 ~ MovieDbJobController ~ find ~ result", result)
    if (error) {
      next(error)
    }

    res.json({
      total: result.total,
      limit: +limit,
      skip: +skip,
      data: result.data,
    });
  }

  // @Get(":id")
  // async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   const { id } = req.params;

  //   if (!id) next(new Error("Requires an id"));

  //   const data = movieJobService.findById(id);

  //   res.json(data);
  // }

  // @Post()
  // async findByVideoId(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   const { id } = req.body;

  //   if (!id) next(new Error("Requires an id"));

  //   const data = movieJobService.findByVideoId(id);

  //   res.json(data);
  // }

  // @Post("make")
  // async make(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   const videos: TVideo[] = await videoModel.find({ type: 'movie' });
  //   const tvShows: TvShow[] = await tvShowModel.find({});
  //   const promises: any = []

  //   try {
  //     for (const video of videos) {
  //       if (!video.posterPath.length) {
  //         promises.push(movieJobService.create({ id: video._id }))
  //       }
  //     }

  //     for (const tvShow of tvShows) {
  //       if (!tvShow.posterPath.length) {
  //         promises.push(movieJobService.create({ id: tvShow._id, type: "tv" }))
  //       }
  //     }

  //     Promise.allSettled(promises).then(result => {
  //       res.json(result)
  //     })
  //   } catch (error) {
  //     res.json(error)
  //   }

  // }

  // @Patch()
  // async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   const { type } = req.body;

  //   if (type === "reset") {
  //     await movieDbJobModel.updateMany(
  //       { status: "done" },
  //       {
  //         status: "todo",
  //       }
  //     );
  //   }

  //   res.json("ok");
  // }

  // @Delete()
  // async deleteAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   const movieJob = await movieDbJobModel.deleteMany();

  //   res.json(movieJob.deletedCount + " deleted")
  // }
}
