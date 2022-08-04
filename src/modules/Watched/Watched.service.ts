import { DeepPartial, DeleteResult } from "typeorm";
import { defaultLimit } from "../../config/defaultConfig";
import { MissingDataPayloadException, err, ok } from "../../services/Error";
import { promisifier } from "../../services/promisifier";
import { Result, TResultService, TWatched } from "../../types";
import { WatchedDTO } from "./Watched.dto";
import { Watched } from "./Watched.entity";
import WatchedRepository from "./Watched.repository";

export default class WatchedService {
  repo: WatchedRepository;
  constructor(repo: WatchedRepository) {
    this.repo = repo;
  }

  async findByVideoId(id: string): Promise<Result<WatchedDTO, Error>> {
    if (!id.length) {
      return err(new MissingDataPayloadException("id"));
    }

    const [result, error] = await promisifier<WatchedDTO>(
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
  ): Promise<Result<TResultService<WatchedDTO>, Error>> {
    const total = await this.repo.getCount();
    const [result, error] = await promisifier<WatchedDTO[]>(
      this.repo.findAll(limit, skip, +id)
    );
    if (error) {
      return err(new Error(error));
    }

    return ok({ total, data: result });
  }

  async create(data: DeepPartial<Watched>): Promise<Result<WatchedDTO, Error>> {
    if (!data.video || !data.user) {
      throw new MissingDataPayloadException("video | user");
    }

    const [result, error] = await promisifier<WatchedDTO>(
      this.repo.create(data)
    );
    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }

  // async update(id: string, data: DeepPartial<Watched>){
  //   return
  // }

  async delete(id: string): Promise<Result<DeleteResult, Error>> {
    if (!id.length) {
      throw new MissingDataPayloadException("id");
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
