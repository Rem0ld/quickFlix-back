import { Types } from "mongoose";
import { DeleteResult } from "typeorm";
import { movieDbJobModel } from "../../schemas/MovieDbJob";
import {
  MovieDbJob,
  Pagination,
  Result,
  TResultService,
  TVideo,
  VideoType,
} from "../../types";
import { MovieDbJobDTO } from "./MovieDbJob.dto";
import MovieDbJobRepository from "./MovieDbJob.repository";

export default class MovieDbJobService {
  repo: MovieDbJobRepository;
  constructor(repo: MovieDbJobRepository) {
    this.repo = repo;
  }

  async find({
    limit,
    skip,
    populate,
  }: Pagination): Promise<Result<MovieDbJobDTO, Error>> {
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

  async findById(
    id: string
  ): Promise<Result<TResultService<MovieDbJobDTO>, Error>> {
    return movieDbJobModel.findById(id);
  }

  async findByVideoId(id: string): Promise<Result<MovieDbJobDTO, Error>> {
    return movieDbJobModel.findOne({
      video: id,
    });
  }

  async findActive(params: {
    type: VideoType;
  }): Promise<Result<TResultService<MovieDbJobDTO>, Error>> {
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

  async create({
    id,
    type = "movie",
  }: {
    id: string;
    type?: VideoType;
  }): Promise<Result<MovieDbJobDTO, Error>> {
    return movieDbJobModel.findOneAndUpdate(
      {
        video: id,
      },
      { video: id, type },
      { upsert: true }
    );
  }

  async update(
    id: string,
    data: Partial<MovieDbJob>
  ): Promise<Result<MovieDbJobDTO, Error>> {
    return movieDbJobModel.findByIdAndUpdate(id, data);
  }

  async deleteOneById(id: string): Promise<Result<DeleteResult, Error>> {
    const movieJob = movieDbJobModel.findByIdAndDelete(id);

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
