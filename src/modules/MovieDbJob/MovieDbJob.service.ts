import { Types } from "mongoose";
import { movieDbJobModel } from "../../schemas/MovieDbJob";
import { MovieDbJob, Pagination, TVideo, VideoType } from "../../types";

class MovieDbJobService {
  async find({ limit, skip, populate }: Pagination): Promise<MovieDbJob[]> {
    if (populate) {
      const movieJobs = await movieDbJobModel
        .find()
        .populate({
          path: "video",
        })
        .limit(limit)
        .skip(skip);

      return movieJobs;
    }
    return movieDbJobModel.find().limit(limit).skip(skip);
  }

  async findById(id: string): Promise<MovieDbJob | undefined | null> {
    return movieDbJobModel.findById(id);
  }

  async findByVideoId(id: string): Promise<MovieDbJob | undefined | null> {
    return movieDbJobModel.findOne({
      video: id,
    });
  }

  async findActive(params: { type: VideoType }): Promise<MovieDbJob[] | undefined | null> {
    const data = await movieDbJobModel
      .find({
        status: "todo",
        type: params.type,
      })
      .populate({
        path: "video",
      });

    return data;
  }

  async create({ id, type = "movie" }: { id: string, type?: VideoType }): Promise<MovieDbJob | null> {
    return movieDbJobModel.findOneAndUpdate({
      video: id,
    }, { video: id, type }, { upsert: true });
  }

  async update(id: string, data: Partial<MovieDbJob>): Promise<MovieDbJob | null | undefined> {
    return movieDbJobModel.findByIdAndUpdate(id, data);
  }

  async deleteOneById(id: string): Promise<MovieDbJob | false | null> {
    const movieJob = movieDbJobModel.findByIdAndDelete(id);

    if (movieJob === null) {
      console.error("cannot find movie job");
      return false;
    }

    return movieJob;
  }

  async deletOneByVideoId(id: string): Promise<MovieDbJob | false | null> {
    const movieJob = movieDbJobModel.findOneAndDelete({
      video: id,
    });

    if (!movieJob) {
      console.error("cannot find movie job");
      return false;
    }

    return movieJob;
  }
}

export const movieJobService = new MovieDbJobService();
