import { DeepPartial, DeleteResult, UpdateResult } from "typeorm";
import { defaultLimit } from "../../config/defaultConfig";
import Joi from "joi";
import {
  MissingDataPayloadException,
  ok,
  err,
  ResourceNotExist,
} from "../../services/Error";
import { promisifier } from "../../services/promisifier";
import { TResultService, RequestBuilder, Result } from "../../types";
import { VideoDTO } from "./Video.dto";
import { Video, VideoTypeEnum } from "./Video.entity";
import { v4 as uuidv4, validate } from "uuid";
import VideoRepository from "./Video.repository";
import { videoSchema } from "./Video.Validation";

// import { movieJobService } from "../MovieDbJob/MovieDbJob.service";

export default class VideoService {
  repo: VideoRepository;
  constructor(videoRepository: VideoRepository) {
    this.repo = videoRepository;
  }

  async findAll(
    limit: number,
    skip: number,
    rest?: Record<string, any>
  ): Promise<Result<TResultService<VideoDTO>, Error>> {
    if (limit === 0) {
      skip = 0;
    }
    const [result, error] = await promisifier<TResultService<VideoDTO>>(
      this.repo.findAll(limit, skip, rest)
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
    id: string
  ): Promise<Result<VideoDTO, MissingDataPayloadException | Error>> {
    if (!id.length) {
      return err(new MissingDataPayloadException("uuid"));
    }

    const [result, error] = await promisifier<VideoDTO>(
      this.repo.findByUuid(id)
    );
    if (error) {
      return err(new Error(error));
    }
    if (!Object.keys(result).length) {
      return err(new ResourceNotExist(id));
    }

    return ok(result);
  }

  async findByFields({
    name,
    episode,
    season,
    type,
    limit = defaultLimit,
    skip = 0,
  }: {
    name?: string;
    episode?: string;
    season?: string;
    type?: VideoTypeEnum[];
    limit?: number;
    skip?: number;
  }): Promise<
    Result<TResultService<VideoDTO>, MissingDataPayloadException | Error>
  > {
    const request: RequestBuilder = {};

    if (name) {
      request.name = name;
    }
    if (episode) {
      request.episode = +episode;
    }
    if (season) {
      request.season = +season;
    }
    if (type) {
      request.type = type;
    }

    const [result, error] = await promisifier<TResultService<VideoDTO>>(
      this.repo.findByFields(request, limit, skip)
    );
    if (error) {
      return err(new Error(error));
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

    if (!Object.keys(data).length) {
      return err(new MissingDataPayloadException("data", data));
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
      return err(new MissingDataPayloadException(valid.value));
    }

    data.uuid = uuidv4();
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

    const [result, error] = await promisifier<DeleteResult>(
      this.repo.delete(+id)
    );
    if (error) {
      return err(new Error(error));
    }

    // await movieJobService.deletOneByVideoId(id);

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
