import { DeleteResult, UpdateResult } from "typeorm";
import { defaultLimit } from "../../config/defaultConfig";
import MissingDataPayloadException, { err, ok } from "../../services/Error";
import { promisifier } from "../../services/promisifier";
import { Result, TResultService, TTvShow } from "../../types";
import { TvShowDTO } from "./TvShow.dto";
import { TvShow } from "./TvShow.entity";
import { TvShowRepository } from "./TvShow.repository";

export default class TvShowService {
  repo: TvShowRepository;
  constructor(repo: TvShowRepository) {
    this.repo = repo;
  }

  async findById(id: string): Promise<Result<TvShowDTO, Error>> {
    if (!id?.length) {
      err(new MissingDataPayloadException("id"))
    }

    const [result, error] = await promisifier<TvShowDTO>(this.repo.findById(+id));
    if (error) {
      err(new Error(error));
    }
    return ok(result)
  }

  // TODO: make join with videos
  async findAll(
    limit: number = defaultLimit,
    skip: number = 0
  ): Promise<TResultService<TvShowDTO>> {
    const total = await this.repo.getCount();
    const [result, error] = await promisifier(this.repo.findAll(limit, skip));
    if (error) {
      throw new Error(error);
    }
    return { total, data: result };
  }

  // async findByName({ name }: { name: string }): Promise<TvShow | null> {
  //   const re = new RegExp(`${name}`, "i");
  //   const result = await tvShowModel.findOne({ name: re });

  //   return result;
  // }

  async create(
    data: Omit<TTvShow, "id">,
    params?: { movieJob: boolean; id: string }
  ): Promise<TvShowDTO> {
    // TODO: Add more validation here
    if (!Object.keys(data).length) {
      throw new Error("missing data");
    }

    // try {
    //   const result = await this.repo.create(data);
    //   return result;
    // } catch (error) {
    //   console.error(error);
    //   throw new Error(error);
    // }

    const [result, error] = await promisifier(this.repo.create(data));
    if (error) {
      throw new Error(error);
    }
    return result;
    // if (params?.movieJob) {
    //   await movieJobService.create({
    //     id: params.id,
    //     type: "tv",
    //   });
    // }
  }

  async update(id: string, data: Partial<TvShow>): Promise<Result<UpdateResult, Error>> {
    if (!id.length) {
      throw new Error("missing id");
    }

    if (!Object.keys(data).length) {
      throw new Error("missing data");
    }

    const [result, error] = await promisifier(this.repo.update(+id, data));
    if (error) {
      throw new Error(error);
    }
    return result;
  }

  async delete(id: string): Promise<Result<DeleteResult, Error>> {
    if (!id.length) {
      throw new Error("missing id");
    }

    const [result, error] = await promisifier(this.repo.delete(+id));
    if (error) {
      throw new Error(error);
    }
    return result;
  }
}
