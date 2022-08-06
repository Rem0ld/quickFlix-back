import { DeepPartial, DeleteResult, EntityManager } from "typeorm";
import { BaseRepository, TResultService, TTvShow } from "../../types";
import { TvShowDTO } from "./TvShow.dto";
import { TvShow } from "./TvShow.entity";
import dynamicQueryBuilder from "../../utils/queryBuilder";

export class TvShowRepository implements BaseRepository<TvShowDTO> {
  constructor(
    private manager: EntityManager,
    private name: string = "tv_show"
  ) { }

  async getCount() {
    return this.manager.count(TvShow);
  }

  async findAll(
    limit: number,
    skip: number
  ): Promise<TResultService<TvShowDTO>> {
    const result = await this.manager
      .getRepository(TvShow)
      .createQueryBuilder(this.name)
      .leftJoinAndSelect("tv_show.videos", "video")
      .take(limit)
      .skip(skip)
      .getManyAndCount();

    return { data: result[0].map(el => new TvShowDTO(el)), total: result[1] };
  }

  async findById(id: number): Promise<TvShowDTO> {
    const result = await this.manager.findOneBy(TvShow, { id });

    return new TvShowDTO(result);
  }

  async findByName(name: string): Promise<TvShowDTO> {
    const result = await dynamicQueryBuilder(
      { name },
      TvShow,
      "tv_show"
    ).getOne();

    return new TvShowDTO(result);
  }

  async create(data: DeepPartial<TvShowDTO>): Promise<TvShowDTO> {
    const result = await this.manager.save(TvShow, { ...data });

    return new TvShowDTO(result);
  }

  async createMany(data: DeepPartial<TvShowDTO[]>): Promise<TvShowDTO[]> {
    const result = await this.manager.save(TvShow, data);

    return result.map(el => new TvShowDTO(el));
  }

  async update(id: number, data: Partial<TvShow>): Promise<TvShowDTO> {
    const result = await this.manager.save(TvShow, { id, ...data });

    return new TvShowDTO(result);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.manager
      .createQueryBuilder(TvShow, this.name)
      .delete()
      .where(`${this.name}.id= :id`, { id })
      .execute();
  }

  async deleteAll(): Promise<DeleteResult> {
    return this.manager.getRepository(TvShow).delete({});
  }
}
