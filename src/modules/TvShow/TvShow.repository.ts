import {
  DeleteResult,
  EntityManager,
  UpdateResult,
} from "typeorm";
import { BaseRepository } from "../../types";
import { TvShow } from "./TvShow.entity";

export class TvShowRepository implements BaseRepository<TvShow> {
  constructor(private manager: EntityManager) { }

  async getCount() {
    return this.manager.count(TvShow);
  }

  findAll(limit: number, skip: number): Promise<TvShow[]> {
    return this.manager
      .getRepository(TvShow)
      .createQueryBuilder(TvShow.name)
      .take(limit)
      .skip(skip)
      .getMany();
  }

  findById(id: number): Promise<TvShow> {
    return this.manager.findOneBy(TvShow, { id });
  }

  create(data: Omit<TvShow, "id">): Promise<TvShow> {
    return this.manager.save(TvShow, { ...data });
  }

  createMany(data: Omit<TvShow, "id">[]): Promise<TvShow[]> {
    return this.manager.save(TvShow, data);
  }

  update(id: number, data: Partial<TvShow>): Promise<UpdateResult> {
    return this.manager.update(TvShow, id, data);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.manager
      .createQueryBuilder(TvShow, TvShow.name)
      .delete()
      .where("id= :id", { id: id })
      .execute();
  }
}
