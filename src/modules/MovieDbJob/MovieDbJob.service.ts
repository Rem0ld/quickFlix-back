import { DeleteResult } from "typeorm";
import { err, MissingDataPayloadException, ok } from "../../services/Error";
import { promisifier } from "../../services/promisifier";
import { Result, TResultService } from "../../types";
import { TvShowDTO } from "../TvShow/TvShow.dto";
import { TvShow } from "../TvShow/TvShow.entity";
import { VideoDTO } from "../Video/Video.dto";
import { Video, VideoTypeEnum } from "../Video/Video.entity";
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
    skip: number,
    rest: Record<string, any>
  ): Promise<Result<TResultService<MovieDbJobDTO>, Error>> {
    const [result, error] = await promisifier<TResultService<MovieDbJobDTO>>(
      this.repo.findAll(limit, skip, rest)
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

  async create(
    payload: VideoDTO | TvShowDTO,
    type: VideoTypeEnum = VideoTypeEnum.MOVIE
  ): Promise<Result<MovieDbJobDTO, Error>> {
    const data: MovieDbJob = new MovieDbJob();

    if (type === "tv") {
      const tvShow = payload as TvShow;
      data.tvShow = tvShow;
      data.type = VideoTypeEnum.TV;
    } else {
      const video = payload as Video;
      data.video = video;
      data.type = VideoTypeEnum.MOVIE;
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

  async delete(): Promise<Result<DeleteResult, Error>> {
    const [result, error] = await promisifier<DeleteResult>(
      this.repo.deleteAll()
    );
    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }
}
