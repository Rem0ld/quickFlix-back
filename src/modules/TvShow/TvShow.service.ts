import { DeepPartial, DeleteResult } from "typeorm";
import { defaultLimit } from "../../config/defaultConfig";
import { MissingDataPayloadException, err, ok } from "../../services/Error";
import { promisifier } from "../../services/promisifier";
import { Result, TResultService } from "../../types";
import { Video } from "../Video/Video.entity";
import { TvShowDTO } from "./TvShow.dto";
import { TvShow } from "./TvShow.entity";
import { TvShowRepository } from "./TvShow.repository";
import { v4 as uuidv4 } from "uuid";
export default class TvShowService {
  constructor(private repo: TvShowRepository) {}

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
    skip = 0
  ): Promise<Result<TResultService<TvShowDTO>, Error>> {
    const [result, error] = await promisifier<TResultService<TvShowDTO>>(
      this.repo.findAll(limit, skip)
    );
    if (error) {
      return err(new Error(error));
    }
    const test = result.data.map((tvShow: TvShowDTO) => {
      tvShow.videos = tvShow.formatVideos() as unknown as Video[];
      return tvShow;
    });
    return ok({ data: test, total: result.total });
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
    data: DeepPartial<TvShowDTO>
  ): Promise<Result<TvShowDTO, Error>> {
    // TODO: Add more validation here
    if (!Object.keys(data).length) {
      return err(new MissingDataPayloadException("data"));
    }

    if (typeof data.firstAirDate === "string") {
      data.firstAirDate = new Date(data.firstAirDate);
    }

    if (!data.uuid) {
      data.uuid = uuidv4();
    }

    const [result, error] = await promisifier<TvShowDTO>(
      this.repo.create(data)
    );
    if (error) {
      return err(new Error(error));
    }

    return ok(result);
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
