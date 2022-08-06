import { DeepPartial, DeleteResult, UpdateResult } from "typeorm";
import { defaultLimit } from "../../config/defaultConfig";
import { MissingDataPayloadException, err, ok } from "../../services/Error";
import { promisifier } from "../../services/promisifier";
import { Result, TResultService, TTvShow } from "../../types";
import { TvShowDTO } from "./TvShow.dto";
import { TvShow } from "./TvShow.entity";
import { TvShowRepository } from "./TvShow.repository";

export default class TvShowService {
  constructor(private repo: TvShowRepository) { }

  async findById(id: string): Promise<Result<TvShowDTO, Error>> {
    if (!id?.length) {
      return err(new MissingDataPayloadException("id"));
    }

    const [result, error] = await promisifier<TvShowDTO>(
      this.repo.findById(+id)
    );
    if (error) {
      return err(new Error(error));
    }
    return ok(result);
  }

  async findAll(
    limit: number = defaultLimit,
    skip: number = 0
  ): Promise<Result<TResultService<TvShowDTO>, Error>> {
    const total = await this.repo.getCount();
    const [result, error] = await promisifier<TResultService<TvShowDTO>>(
      this.repo.findAll(limit, skip)
    );
    if (error) {
      return err(new Error(error));
    }
    return ok(result);
  }

  async findByName(name: string): Promise<Result<TvShowDTO, Error>> {
    if (!name.length) {
      return err(new MissingDataPayloadException("name"));
    }
    const [result, error] = await promisifier<TvShowDTO>(
      this.repo.findByName(name)
    );
    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }

  async create(
    data: DeepPartial<TvShowDTO>,
    params?: { movieJob: boolean; id: string }
  ): Promise<Result<TvShowDTO, Error>> {
    // TODO: Add more validation here
    if (!Object.keys(data).length) {
      return err(new MissingDataPayloadException("data"));
    }

    // try {
    //   const result = await this.repo.create(data);
    //   return result;
    // } catch (error) {
    //   console.error(error);
    //   throw new Error(error);
    // }

    const [result, error] = await promisifier<TvShowDTO>(
      this.repo.create(data)
    );
    if (error) {
      return err(new Error(error));
    }

    return ok(result);
    // if (params?.movieJob) {
    //   await movieJobService.create({
    //     id: params.id,
    //     type: "tv",
    //   });
    // }
  }

  async patch(
    id: string,
    data: Partial<TvShow>
  ): Promise<Result<TvShowDTO, Error>> {
    if (!id.length) {
      return err(new MissingDataPayloadException("id"));
    }

    if (!Object.keys(data).length) {
      return err(new MissingDataPayloadException("data"));
    }

    const [result, error] = await promisifier<TvShowDTO>(
      this.repo.update(+id, data)
    );

    if (error) {
      return err(new Error(error));
    }
    return ok(result);
  }

  async delete(id: string): Promise<Result<DeleteResult, Error>> {
    if (!id.length) {
      return err(new MissingDataPayloadException("id"));
    }

    const [result, error] = await promisifier<DeleteResult>(
      this.repo.delete(+id)
    );

    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }

  async deleteAll(): Promise<Result<DeleteResult, Error>> {
    const [result, error] = await promisifier<DeleteResult>(
      this.repo.deleteAll()
    );

    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }
}
