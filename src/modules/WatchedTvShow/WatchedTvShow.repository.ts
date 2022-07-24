import { DeepPartial, DeleteResult, EntityManager } from "typeorm";
import { BaseRepository, TWatchedTvShow } from "../../types";
import { WatchedTvShow } from "./WatchedTvShow.entity";

export class WatchedTvShowRepository implements BaseRepository<WatchedTvShow> {
  constructor(
    private manager: EntityManager,
    private name: string = "watched_tv_show"
  ) { }

  async getCount(): Promise<number> {
    return this.manager.count(WatchedTvShow);
  }

  async findAll(
    limit: number,
    skip: number,
    id?: number
  ): Promise<WatchedTvShow[]> {
    return this.manager
      .getRepository(WatchedTvShow)
      .createQueryBuilder(this.name)
      .where(`${this.name}.user = :id`, { id })
      .leftJoinAndSelect(`${this.name}.tvShow`, "tvShow")
      .leftJoin(`${this.name}.watched`, "watched")
      .take(limit)
      .skip(skip)
      .getMany();
  }

  async findById(id: number): Promise<WatchedTvShow> {
    return this.manager.findOneBy(WatchedTvShow, { id });
  }

  async create(data: DeepPartial<WatchedTvShow>): Promise<WatchedTvShow> {
    return this.manager.save(WatchedTvShow, data);
  }

  async createMany(
    data: DeepPartial<WatchedTvShow[]>
  ): Promise<WatchedTvShow[]> {
    return this.manager.save(WatchedTvShow, data);
  }

  async update(
    id: number,
    data: Partial<WatchedTvShow>
  ): Promise<WatchedTvShow> {
    return this.manager.save(WatchedTvShow, { id, ...data });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.manager
      .createQueryBuilder(WatchedTvShow, this.name)
      .delete()
      .where(`${this.name}.id = :id`, { id })
      .execute();
  }
}
