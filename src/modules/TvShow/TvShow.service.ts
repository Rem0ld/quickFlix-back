import { DeleteResult, TableInheritance, UpdateResult } from "typeorm";
import { defaultLimit } from "../../config/defaultConfig";
import { promisifier } from "../../services/promisifier";
import { Pagination, TResultService, TTvShow } from "../../types";
import { movieJobService } from "../MovieDbJob/MovieDbJob.service";
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

    try {
      const data = await this.repo.findById(+id);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  // TODO: make join with videos
  async findAll(limit: number = defaultLimit, skip: number = 0): Promise<TResultService<TvShow>> {
    const total = await this.repo.getCount();
    const [data, error] = await promisifier(this.repo.findAll(limit, skip));
    if (error) {
      throw new Error("Cannot find all tvShows, probably due to reaching DB");
    }
    return { total, data };
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

    try {
      const result = await this.repo.update(+id, data);
      return result;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    if (!id.length) {
      throw new Error("missing id");
    }

    try {
      const result = await this.repo.delete(+id);
      return result;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}
