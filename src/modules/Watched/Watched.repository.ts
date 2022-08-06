import { DeepPartial, DeleteResult, EntityManager } from "typeorm";
import { BaseRepository, TResultService } from "../../types";
import { WatchedDTO } from "./Watched.dto";
import { Watched } from "./Watched.entity";

export default class WatchedRepository implements BaseRepository<WatchedDTO> {
  constructor(
    private manager: EntityManager,
    private name: string = "watched"
  ) { }

  async getCount(): Promise<number> {
    return this.manager.count(Watched);
  }

  async findAll(
    limit: number,
    skip: number,
    id: number
  ): Promise<TResultService<WatchedDTO>> {
    const result = await this.manager
      .getRepository(Watched)
      .createQueryBuilder(this.name)
      .where(`${this.name}.user = :id`, { id })
      .leftJoinAndSelect(`${this.name}.video`, "video")
      .take(limit)
      .skip(skip)
      .getManyAndCount();

    return { data: result[0].map(el => new WatchedDTO(el)), total: result[1] };
  }

  async findById(id: number): Promise<WatchedDTO> {
    const result = await this.manager.findOneBy(Watched, { id });

    return new WatchedDTO(result);
  }

  async create(data: DeepPartial<Watched>): Promise<WatchedDTO> {
    const result = await this.manager.save(Watched, data);

    return new WatchedDTO(result);
  }

  async createMany(data: DeepPartial<Watched[]>): Promise<WatchedDTO[]> {
    const result = await this.manager.save(Watched, data);

    return result.map(el => new WatchedDTO(el));
  }

  async update(id: number, data: Partial<Watched>): Promise<WatchedDTO> {
    const result = await this.manager.save(Watched, { id, ...data });

    return new WatchedDTO(result);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.manager
      .createQueryBuilder(Watched, this.name)
      .delete()
      .where(`${this.name}.id = :id`, { id })
      .execute();
  }
}