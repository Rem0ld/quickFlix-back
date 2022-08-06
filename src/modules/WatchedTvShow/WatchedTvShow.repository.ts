import { DeepPartial, DeleteResult, EntityManager } from "typeorm";
import { BaseRepository, TResultService, TWatchedTvShow } from "../../types";
import { WatchedTvShowDTO } from "./WatchedTvShow.dto";
import { WatchedTvShow } from "./WatchedTvShow.entity";

export class WatchedTvShowRepository
  implements BaseRepository<WatchedTvShowDTO>
{
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
  ): Promise<TResultService<WatchedTvShowDTO>> {
    const result = await this.manager
      .getRepository(WatchedTvShow)
      .createQueryBuilder(this.name)
      .where(`${this.name}.user = :id`, { id })
      .leftJoinAndSelect(`${this.name}.tvShow`, "tvShow")
      .leftJoin(`${this.name}.watched`, "watched")
      .take(limit)
      .skip(skip)
      .getManyAndCount();

    return {
      data: result[0].map(el => new WatchedTvShowDTO(el)),
      total: result[1],
    };
  }

  async findById(id: number): Promise<WatchedTvShowDTO> {
    const result = await this.manager.findOneBy(WatchedTvShow, { id });

    return new WatchedTvShowDTO(result);
  }

  async create(data: DeepPartial<WatchedTvShow>): Promise<WatchedTvShowDTO> {
    const result = await this.manager.save(WatchedTvShow, data);

    return new WatchedTvShowDTO(result);
  }

  async createMany(
    data: DeepPartial<WatchedTvShow[]>
  ): Promise<WatchedTvShowDTO[]> {
    const result = await this.manager.save(WatchedTvShow, data);

    return result.map(el => new WatchedTvShowDTO(el));
  }

  async update(
    id: number,
    data: Partial<WatchedTvShow>
  ): Promise<WatchedTvShowDTO> {
    const result = await this.manager.save(WatchedTvShow, { id, ...data });

    return new WatchedTvShowDTO(result);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.manager
      .createQueryBuilder(WatchedTvShow, this.name)
      .delete()
      .where(`${this.name}.id = :id`, { id })
      .execute();
  }
}
