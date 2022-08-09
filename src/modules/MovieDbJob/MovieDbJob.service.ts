import { DeleteResult } from "typeorm";
import { err, MissingDataPayloadException, ok } from "../../services/Error";
import { promisifier } from "../../services/promisifier";
import { Result, TResultService, VideoType } from "../../types";
import { VideoTypeEnum } from "../Video/Video.entity";
import { MovieDbJobDTO } from "./MovieDbJob.dto";
import MovieDbJobRepository from "./MovieDbJob.repository";

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

  async findByVideoId(id: string): Promise<Result<MovieDbJobDTO, Error>> { }

  async findActive(params: {
    type: VideoType;
  }): Promise<Result<TResultService<MovieDbJobDTO>, Error>> { }

  async create(
    videoId: string,
    type: VideoTypeEnum = VideoTypeEnum.MOVIE
  ): Promise<Result<MovieDbJobDTO, Error>> {
    if (!videoId.length) {
      return err(new MissingDataPayloadException("id"));
    }

    const [result, error] = await promisifier<MovieDbJobDTO>(
      this.repo.create({
        video: videoId,
        type,
      })
    );
    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }

  async update(
    id: string,
    data: Partial<MovieDbJobDTO>
  ): Promise<Result<MovieDbJobDTO, Error>> { }

  async deleteOneById(id: string): Promise<Result<DeleteResult, Error>> { }

  async deletOneByVideoId(id: string): Promise<MovieDbJob | false | null> { }
}
