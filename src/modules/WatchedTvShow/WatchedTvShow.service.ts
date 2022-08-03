import { DeepPartial, DeleteResult } from "typeorm";
import { defaultLimit } from "../../config/defaultConfig";
import MissingDataPayloadException, { err, ok } from "../../services/Error";
import { promisifier } from "../../services/promisifier";
import { Result, TResultService } from "../../types";
import { WatchedTvShowDTO } from "./WatchedTvShow.dto";
import { WatchedTvShow } from "./WatchedTvShow.entity";
import { WatchedTvShowRepository } from "./WatchedTvShow.repository";
export default class WatchedTvShowService {
  repo: WatchedTvShowRepository;
  constructor(repo: WatchedTvShowRepository) {
    this.repo = repo;
  }

  async findById(id: string): Promise<Result<WatchedTvShowDTO, Error>> {
    if (!id.length) {
      return err(new MissingDataPayloadException("id"));
    }

    const [result, error] = await promisifier<WatchedTvShowDTO>(
      this.repo.findById(+id)
    );

    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }

  async findAll(
    limit: number = defaultLimit,
    skip: number = 0,
    id: string
  ): Promise<Result<TResultService<WatchedTvShow>, Error>> {
    const total = await this.repo.getCount();
    const [result, error] = await promisifier<WatchedTvShowDTO[]>(
      this.repo.findAll(limit, skip, +id)
    );

    if (error) {
      return err(new Error(error));
    }
    return ok({ total, data: result });
  }

  async create(
    data: DeepPartial<WatchedTvShow>
  ): Promise<Result<WatchedTvShowDTO, Error>> {
    if (!data.tvShow || !data.user || !data.watched) {
      return err(new MissingDataPayloadException("data"));
    }

    const [result, error] = await promisifier<WatchedTvShowDTO>(
      this.repo.create(data)
    );

    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }

  async delete(id: string): Promise<Result<DeleteResult, Error>> {
    const [result, error] = await promisifier<DeleteResult>(
      this.repo.delete(+id)
    );

    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }
}
