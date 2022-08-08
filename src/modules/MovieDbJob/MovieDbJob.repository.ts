import { DeepPartial, DeleteResult, EntityManager } from "typeorm";
import { BaseRepository, TResultService } from "../../types";
import { MovieDbJobDTO } from "./MovieDbJob.dto";
import { MovieDbJob } from "./MovieDbJob.entity";

export default class MovieDbJobRepository
  implements BaseRepository<MovieDbJobDTO>
{
  constructor(private manager: EntityManager) { }

  async getCount(): Promise<number> {
    return this.manager.count(MovieDbJob);
  }

  async findAll(
    limit: number,
    skip: number,
    id?: number
  ): Promise<TResultService<MovieDbJobDTO>> {
    const result = await this.manager
      .getRepository(MovieDbJob)
      .createQueryBuilder("movie_job")
      .take(limit)
      .skip(skip)
      .getManyAndCount();

    return {
      data: result[0].map(el => new MovieDbJobDTO(el)),
      total: result[1],
    };
  }

  async findById(id: number): Promise<MovieDbJobDTO> {
    const result = await this.manager.findOneBy(MovieDbJob, {
      id,
    });

    return new MovieDbJobDTO(result);
  }

  async create(data: DeepPartial<MovieDbJobDTO>): Promise<MovieDbJobDTO> {
    const result = await this.manager.save(MovieDbJob, { ...data });
    return new MovieDbJobDTO(result);
  }

  async createMany(
    data: DeepPartial<MovieDbJobDTO>[]
  ): Promise<MovieDbJobDTO[]> {
    const result = await this.manager.save(MovieDbJob, data);

    return result.map(el => new MovieDbJobDTO(el));
  }

  async update(
    id: number,
    data: Partial<MovieDbJobDTO>
  ): Promise<MovieDbJobDTO> {
    const result = await this.manager.save(MovieDbJob, { id, ...data });

    return new MovieDbJobDTO(result);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.manager
      .createQueryBuilder(MovieDbJob, "movie_job")
      .delete()
      .where("id= :id", { id })
      .execute();
  }
}
