import { DeepPartial, DeleteResult } from "typeorm";
import {
  MissingDataPayloadException,
  ok,
  err,
  ResourceNotExist,
} from "../../services/Error";
import { promisifier } from "../../services/promisifier";
import { TResultService, Result } from "../../types";
import { VideoDTO } from "./Video.dto";
import { Video } from "./Video.entity";
import { v4 as uuidv4 } from "uuid";
import VideoRepository from "./Video.repository";
import { patchVideoSchema, videoSchema } from "./Video.Validation";
import path from "path";
import { UserDTO } from "../User/User.dto";
import MovieDbJobService from "../MovieDbJob/MovieDbJob.service";

// import { movieJobService } from "../MovieDbJob/MovieDbJob.service";

export default class VideoService {
  constructor(
    private repo: VideoRepository,
    private movieJobService: MovieDbJobService
  ) {}

  async getPath(uuid: string): Promise<Result<string, Error>> {
    const [result, error] = await this.findByUuid(uuid);
    if (error) {
      return err(error);
    }

    const pathname = result.location + path.sep + result.filename + result.ext;
    return ok(pathname);
  }

  async findAll(
    limit: number,
    skip: number,
    user: string,
    rest?: Record<string, any>
  ): Promise<Result<TResultService<VideoDTO>, Error>> {
    if (limit === 0) {
      skip = 0;
    }
    const [result, error] = await promisifier<TResultService<VideoDTO>>(
      this.repo.findAll(limit, skip, new UserDTO(JSON.parse(user)), rest)
    );
    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }

  async findById(
    id: string
  ): Promise<Result<VideoDTO, MissingDataPayloadException | Error>> {
    if (!id.length) {
      return err(new MissingDataPayloadException("id"));
    }

    const [result, error] = await promisifier<VideoDTO>(
      this.repo.findById(+id)
    );
    if (error) {
      return err(new Error(error));
    }
    if (!Object.keys(result).length) {
      return err(new ResourceNotExist(id));
    }

    return ok(result);
  }

  async findByUuid(
    id: string,
    user?: string
  ): Promise<Result<VideoDTO, MissingDataPayloadException | Error>> {
    if (!id.length) {
      return err(new MissingDataPayloadException("uuid"));
    }

    const [result, error] = await promisifier<VideoDTO>(
      this.repo.findByUuid(id, new UserDTO(JSON.parse(user)))
    );
    if (error) {
      return err(new Error(error));
    }
    if (!Object.keys(result).length) {
      return err(new ResourceNotExist(id));
    }

    return ok(result);
  }

  async patch(
    id: string,
    data: Partial<Video>
  ): Promise<Result<VideoDTO, MissingDataPayloadException | Error>> {
    if (!id.length) {
      return err(new MissingDataPayloadException("id", data));
    }
    const valid = patchVideoSchema.validate(data);
    if (valid.error) {
      return err(new MissingDataPayloadException(valid.error.message));
    }

    const [result, error] = await promisifier<VideoDTO>(
      this.repo.update(+id, data)
    );
    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }

  async create(
    data: DeepPartial<VideoDTO>
  ): Promise<Result<VideoDTO, MissingDataPayloadException>> {
    const valid = videoSchema.validate(data);
    if (valid.error) {
      return err(new MissingDataPayloadException(valid.error.message));
    }

    if (!data.uuid) {
      data.uuid = uuidv4();
    }

    const [result, error] = await promisifier<VideoDTO>(this.repo.create(data));
    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }

  async deleteOneById(
    id: string
  ): Promise<Result<DeleteResult, MissingDataPayloadException | Error>> {
    if (!id.length) {
      return err(new MissingDataPayloadException("id"));
    }

    const [movieJob, errorMovieJob] = await this.movieJobService.findAndDelete(
      id
    );
    if (errorMovieJob) {
      return err(errorMovieJob);
    }
    const [result, error] = await promisifier<DeleteResult>(
      this.repo.delete(+id)
    );
    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }

  // TODO: add some kind of validation here to be sure admin is doing it
  async deleteAll(): Promise<Result<DeleteResult, Error>> {
    const [result, error] = await promisifier<DeleteResult>(
      this.repo.deleteAll()
    );
    if (error) {
      return err(new Error(error));
    }
    return ok(result);
    // const movieJob = await movieDbJobModel.deleteMany();
    // const tvShow = await tvShowModel.deleteMany();
  }
}
