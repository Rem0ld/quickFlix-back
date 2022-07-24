import { DeepPartial } from "typeorm";
import { defaultLimit } from "../../config/defaultConfig";
import MissingDataPayloadException from "../../services/Error";
import { promisifier } from "../../services/promisifier";
import { TResultService } from "../../types";
import { WatchedTvShow } from "./WatchedTvShow.entity";
import { WatchedTvShowRepository } from "./WatchedTvShow.repository";
export default class WatchedTvShowService {
  repo: WatchedTvShowRepository;
  constructor(repo: WatchedTvShowRepository) {
    this.repo = repo;
  }

  async findById(id: string): Promise<WatchedTvShow | null> {
    if (!id.length) {
      throw new MissingDataPayloadException("id");
    }

    const [result, error] = await promisifier(this.repo.findById(+id));
    if (error) {
      throw new Error(error);
    }

    return result;
  }

  async findAll(
    limit: number = defaultLimit,
    skip: number = 0,
    id: string
  ): Promise<TResultService<WatchedTvShow>> {
    const count = await this.repo.getCount();
    const [result, error] = await promisifier(this.repo.findAll(limit, skip, +id));
    if (error) {
      throw new Error(error);
    }
    return { total: count, data: result };
  }

  async create(data: DeepPartial<WatchedTvShow>): Promise<WatchedTvShow | Error> {
    if (!data.tvShow || !data.user || !data.watched) {
      throw new Error("missing data to create");
    }

    const [result, error] = await promisifier(this.repo.create(data));
    if (error) {
      throw new Error(error);
    }
    return result;
  }

  async delete(id: string) {
    const [result, error] = await promisifier(this.repo.delete(+id));
    if (error) {
      throw new Error(error);
    }
    return result;
  }
}
