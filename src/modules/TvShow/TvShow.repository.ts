import { DeleteResult, EntityManager, UpdateResult } from "typeorm";
import { BaseRepository, TTvShow } from "../../types";
import { TvShow } from "./TvShow.entity";

export class TvShowRepository implements BaseRepository<TvShow> {
  constructor(
    private manager: EntityManager,
    private name: string = "tv_show"
  ) { }

  async getCount() {
    return this.manager.count(TvShow);
  }

  findAll(limit: number, skip: number): Promise<TvShow[]> {
    return this.manager
      .getRepository(TvShow)
      .createQueryBuilder(this.name)
      .leftJoinAndSelect("tv_show.videos", "video")
      .take(limit)
      .skip(skip)
      .getMany();
  }

  findById(id: number): Promise<TvShow> {
    return this.manager.findOneBy(TvShow, { id });
  }

  create(data: Omit<TTvShow, "id">): Promise<TvShow> {
    return this.manager.save(TvShow, { ...data });
  }

  createMany(data: Omit<TTvShow, "id">[]): Promise<TvShow[]> {
    return this.manager.save(TvShow, data);
  }

  update(id: number, data: Partial<TvShow>): Promise<TvShow> {
    return this.manager.save(TvShow, { id, ...data });
  }

  delete(id: number): Promise<DeleteResult> {
    return this.manager
      .createQueryBuilder(TvShow, this.name)
      .delete()
      .where(`${this.name}.id= :id`, { id })
      .execute();
  }
}
