import { DeepPartial, DeleteResult } from "typeorm";
import { defaultLimit } from "../../config/defaultConfig";
import MissingDataPayloadError from "../../services/Error";
import { promisifier } from "../../services/promisifier";
import { TResultService, TWatched } from "../../types";
import { WatchedTvShow } from "../WatchedTvShow/WatchedTvShow.entity";
import { Watched } from "./Watched.entity";
import WatchedRepository from "./Watched.repository";

export default class WatchedService {
  repo: WatchedRepository;
  constructor(repo: WatchedRepository) {
    this.repo = repo;
  }

  async findByVideoId(
    id: string
  ): Promise<Watched | MissingDataPayloadError | Error> {
    if (!id.length) {
      throw new MissingDataPayloadError("id");
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
  ): Promise<TResultService<Watched>> {
    const count = await this.repo.getCount();
    const [result, error] = await promisifier(
      this.repo.findAll(limit, skip, +id)
    );
    if (error) {
      throw new Error(error);
    }

    return result;
  }

  async create(data: DeepPartial<Watched>): Promise<WatchedTvShow | Error> {
    if (!data.video || !data.user) {
      throw new MissingDataPayloadError("video | user");
    }

    const [result, error] = await promisifier(this.repo.create(data));
    if (error) {
      throw new Error(error);
    }

    return result;
  }

  // async update(id: string, data: DeepPartial<Watched>){
  //   return
  // }

  async delete(id: string): Promise<DeleteResult> {
    if (!id.length) {
      throw new MissingDataPayloadError("id");
    }

    const [result, error] = await promisifier(this.repo.delete(+id));
    if (error) {
      throw new Error(error);
    }

    return result;
  }
}
