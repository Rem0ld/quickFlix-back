import { DeleteResult, EntityManager } from "typeorm";
import { BaseRepository, TTvShow } from "../../types";
import { TvShowDTO } from "./TvShow.dto";
import { TvShow } from "./TvShow.entity";

export class TvShowRepository implements BaseRepository<TvShowDTO> {
  constructor(
    private manager: EntityManager,
    private name: string = "tv_show"
  ) { }

  async getCount() {
    return this.manager.count(TvShow);
  }

  async findAll(limit: number, skip: number): Promise<TvShowDTO[]> {
    const result = await this.manager
      .getRepository(TvShow)
      .createQueryBuilder(this.name)
      .leftJoinAndSelect("tv_show.videos", "video")
      .take(limit)
      .skip(skip)
      .getMany();

    return result.map(el => new TvShowDTO(el))
  }

  async findById(id: number): Promise<TvShowDTO> {
    const result = await this.manager.findOneBy(TvShow, { id });

    return new TvShowDTO(result)
  }

  async create(data: Omit<TTvShow, "id">): Promise<TvShowDTO> {
    const result = await this.manager.save(TvShow, { ...data });

    return new TvShowDTO(result)
  }

  async createMany(data: Omit<TTvShow, "id">[]): Promise<TvShowDTO[]> {
    const result = await this.manager.save(TvShow, data);

    return result.map(el => new TvShowDTO(el))
  }

  async update(id: number, data: Partial<TvShow>): Promise<TvShowDTO> {
    const result = await this.manager.save(TvShow, { id, ...data });

    return new TvShowDTO(result)
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.manager
      .createQueryBuilder(TvShow, this.name)
      .delete()
      .where(`${this.name}.id= :id`, { id })
      .execute();
  }
}
