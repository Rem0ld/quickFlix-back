import { DeleteResult, UpdateResult } from "typeorm";
import { defaultLimit } from "../../config/defaultConfig";
import { promisifier } from "../../services/promisifier";
import { TResultService, TTvShow } from "../../types";
import { TvShow } from "./TvShow.entity";
import { TvShowRepository } from "./TvShow.repository";

export default class TvShowService {
  repo: TvShowRepository;
  constructor(repo: TvShowRepository) {
    this.repo = repo;
  }

  async findById(id: string): Promise<TvShow | null> {
    if (!id?.length) {
      throw new Error("missing ID");
    }

    const [result, error] = await promisifier(this.repo.findById(+id));
    if (error) {
      throw new Error(error);
    }
    return result;
  }

  // TODO: make join with videos
  async findAll(
    limit: number = defaultLimit,
    skip: number = 0
  ): Promise<TResultService<TvShow>> {
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
  ): Promise<TvShow> {
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

  async update(id: string, data: Partial<TvShow>): Promise<UpdateResult> {
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

  async delete(id: string): Promise<DeleteResult> {
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
