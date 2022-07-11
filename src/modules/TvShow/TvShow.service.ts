import { TableInheritance } from "typeorm";
import { Pagination } from "../../types";
import { movieJobService } from "../MovieDbJob/MovieDbJob.service";
import { TvShow } from "./TvShow.entity";
import { TvShowRepository } from "./TvShow.repository";

class TvShowService {
  repo: TvShowRepository;
  constructor(repo: TvShowRepository) { }

  async findById(id: string) {
    if (!id?.length) {
      throw new Error("missing ID");
    }

    const data = await this.repo.findById(parseInt(id));
    return data;
  }

  // TODO: make join with videos
  async findAll(
    limit: number,
    skip: number,
    populate: boolean
  ): Promise<{ total: number; data: TvShow[] }> {
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
    const result = await this.repo.create(data);

    // if (params?.movieJob) {
    //   await movieJobService.create({
    //     id: params.id,
    //     type: "tv",
    //   });
    // }

    return result;
  }

  async update(id: string, data: Partial<TvShow>) {
    try {
      const result = await this.repo.update(parseInt(id), data);
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Cannot update record");
    }
  }

  async delete(id: string) {
    try {
      const result = await this.repo.delete(parseInt(id));
      console.log(result);
      return {};
    } catch (error) {
      console.error(error);
      throw new Error("cannot delete record");
    }
  }
}
