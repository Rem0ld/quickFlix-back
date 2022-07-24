import { DeepPartial, DeleteResult, EntityManager } from "typeorm";
import { BaseRepository } from "../../types";
import { Watched } from "./Watched.entity";

export default class WatchedRepository implements BaseRepository<Watched> {
  constructor(
    private manager: EntityManager,
    private name: string = "watched"
  ) { }

  async getCount(): Promise<number> {
    return this.manager.count(Watched);
  }

  async findAll(limit: number, skip: number, id: number): Promise<Watched[]> {
    return this.manager
      .getRepository(Watched)
      .createQueryBuilder(this.name)
      .where(`${this.name}.user = :id`, { id })
      .leftJoinAndSelect(`${this.name}.video`, "video")
      .take(limit)
      .skip(skip)
      .getMany();
  }

  async findById(id: number): Promise<Watched> {
    return this.manager.findOneBy(Watched, { id });
  }

  async create(data: DeepPartial<Watched>): Promise<Watched> {
    return this.manager.save(Watched, data);
  }

  async createMany(data: DeepPartial<Watched[]>): Promise<Watched[]> {
    return this.manager.save(Watched, data);
  }

  async update(id: number, data: Partial<Watched>): Promise<Watched> {
    return this.manager.save(Watched, { id, ...data });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.manager
      .createQueryBuilder(Watched, this.name)
      .delete()
      .where(`${this.name}.id = :id`, { id })
      .execute();
  }
}
