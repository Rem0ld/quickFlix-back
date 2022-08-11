import { DeleteResult } from "typeorm";
import { err, MissingDataPayloadException, ok } from "../../services/Error";
import { promisifier } from "../../services/promisifier";
import { Result, TResultService, VideoType } from "../../types";
import { VideoTypeEnum } from "../Video/Video.entity";
import { MovieDbJobDTO } from "./MovieDbJob.dto";
import { MovieDbJob } from "./MovieDbJob.entity";
import { MovieDbJobRepository } from "./MovieDbJob.repository";

export default class MovieDbJobService {
  repo: MovieDbJobRepository;
  constructor(repo: MovieDbJobRepository) {
    this.repo = repo;
  }

  async find(
    limit: number,
    skip: number
  ): Promise<Result<TResultService<MovieDbJobDTO>, Error>> {
    const [result, error] = await promisifier<TResultService<MovieDbJobDTO>>(
      this.repo.findAll(limit, skip)
    );
    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }

  async findById(id: string): Promise<Result<MovieDbJobDTO, Error>> {
    if (!id.length) {
      return err(new MissingDataPayloadException("id"));
    }

    const [result, error] = await promisifier<MovieDbJobDTO>(
      this.repo.findById(+id)
    );
    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }

  // async findBy(data: {
  //   video?: string;
  //   type?: VideoType;
  // }): Promise<Result<TResultService<MovieDbJobDTO>, Error>> { }

  async create(
    id: number,
    type: VideoTypeEnum = VideoTypeEnum.MOVIE
  ): Promise<Result<MovieDbJobDTO, Error>> {
    let data: MovieDbJob = new MovieDbJob()

    if (type === "tv") {
      data.tvShowId = id
      data.type = VideoTypeEnum.TV
    } else {
      data.videoId = id
      data.type = VideoTypeEnum.MOVIE
    }

    const [result, error] = await promisifier<MovieDbJobDTO>(
      this.repo.create(data)
    );
    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }

  async patch(
    id: string,
    data: Partial<MovieDbJob>
  ): Promise<Result<MovieDbJobDTO, Error>> {
    if (!id.length) {
      return err(new MissingDataPayloadException("id", data));
    }
    if (!Object.keys(data).length) {
      return err(new MissingDataPayloadException("data", data));
    }

    const [result, error] = await promisifier<MovieDbJobDTO>(
      this.repo.update(+id, data)
    );
    if (error) {
      return err(error);
    }

    return ok(result);
  }

  async deleteOneById(id: string): Promise<Result<DeleteResult, Error>> {
    if (!id.length) {
      return err(new MissingDataPayloadException("id", id));
    }

    const [result, error] = await promisifier<DeleteResult>(
      this.repo.delete(+id)
    );
    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }
}
