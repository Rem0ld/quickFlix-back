import { TableInheritance } from "typeorm";
import { Pagination, TResultService } from "../../types";
import { movieJobService } from "../MovieDbJob/MovieDbJob.service";
import { TvShow } from "./TvShow.entity";
import { TvShowRepository } from "./TvShow.repository";

export default class TvShowService {
  repo: TvShowRepository;
  constructor(repo: TvShowRepository) { }

  async findById(id: string) {
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
  async findAll(
    limit: number,
    skip: number
  ): Promise<TResultService<TvShow[]>> {
    try {
      const total = await this.repo.getCount();
      const data = await this.repo.findAll(limit, skip);
      return { total, data };
    } catch (error) {
      console.error(error);
      throw new Error("Cannot find all tvShows, probably due to reaching DB");
    }
  }

  // async findByName({ name }: { name: string }): Promise<TvShow | null> {
  //   const re = new RegExp(`${name}`, "i");
  //   const result = await tvShowModel.findOne({ name: re });

  //   return result;
  // }

  async create(data: TvShow, params?: { movieJob: boolean; id: string }) {
    // TODO: Add more validation here
    if (!Object.keys(data).length) {
      throw new Error("missing data");
    }

    try {
      const result = await this.repo.create(data);
      return result;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }

    // if (params?.movieJob) {
    //   await movieJobService.create({
    //     id: params.id,
    //     type: "tv",
    //   });
    // }
  }

  async update(id: string, data: Partial<TvShow>) {
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

  async delete(id: string) {
    if (!id.length) {
      throw new Error("missing id");
    }

    try {
      const result = await this.repo.delete(+id);
      console.log(result);
      return {};
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}
