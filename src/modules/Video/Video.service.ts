import { DeepPartial, DeleteResult, UpdateResult } from "typeorm";
import { defaultLimit } from "../../config/defaultConfig";
import MissingDataPayloadException, { ok, err } from "../../services/Error";
import { promisifier } from "../../services/promisifier";
import { TResultService, RequestBuilder, Result } from "../../types";
import { VideoDTO } from "./Video.dto";
import { Video, VideoTypeEnum } from "./Video.entity";
import VideoRepository from "./Video.repository";

// import { movieJobService } from "../MovieDbJob/MovieDbJob.service";

export default class VideoService {
  videoRepo: VideoRepository;
  constructor(videoRepository: VideoRepository) {
    this.videoRepo = videoRepository;
  }

  async findById(
    id: string
  ): Promise<Result<VideoDTO, MissingDataPayloadException | Error>> {
    if (!id.length) {
      return err(new MissingDataPayloadException("id"));
    }

    const [result, error] = await promisifier(this.videoRepo.findById(+id));
    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }

  async findAll(
    limit: number = defaultLimit,
    skip: number = 0
  ): Promise<
    Result<TResultService<VideoDTO>, MissingDataPayloadException | Error>
  > {
    // TODO: prepare db request in data layer
    const total = await this.videoRepo.getCount();
    const [result, error] = await promisifier(
      this.videoRepo.findAll(limit, skip)
    );
    if (error) {
      return err(new Error(error));
    }
    return ok({ data: result, total });
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

    const total = await this.videoRepo.getCount();
    const [result, error] = await promisifier(
      this.videoRepo.findByFields(request, limit, skip)
    );
    if (error) {
      return err(new Error(error));
    }

    return ok({ data: result, total });
    // if (!videos) throw new Error("Cannot find videos");
  }

  async patch(
    id: string,
    data: Partial<Video>
  ): Promise<Result<UpdateResult, MissingDataPayloadException | Error>> {
    if (!id.length) {
      return err(new MissingDataPayloadException("id"));
    }

    if (!Object.keys(data).length) {
      return err(new MissingDataPayloadException());
    }

    const [result, error] = await promisifier(this.videoRepo.update(+id, data));
    if (error) {
      return err(new Error(error));
    }

    return ok(result);
  }

  async create(
    data: DeepPartial<VideoDTO>,
    params: { movieJob: boolean }
  ): Promise<Result<VideoDTO, MissingDataPayloadException | Error>> {
    // TODO: validation to make sure video has everything needed
    if (!data?.name?.length) {
      return err(new MissingDataPayloadException("name"));
    }
    const [result, error] = await promisifier(this.videoRepo.create(data));
    if (error) {
      return err(new Error(error));
    }

    if (params.movieJob) {
      // await movieJobService.create({ id: video._id });
    }

    return ok(result);
  }

  async deleteOneById(
    id: string
  ): Promise<Result<DeleteResult, MissingDataPayloadException | Error>> {
    if (!id.length) {
      return err(new MissingDataPayloadException("id"));
    }

    const [result, error] = await promisifier(this.videoRepo.delete(+id));
    if (error) {
      return err(new Error(error));
    }

    // await movieJobService.deletOneByVideoId(id);

    return ok(result);
  }

  // TODO: add some kind of validation here to be sure admin is doing it
  async deleteAll(): Promise<Result<void, Error>> {
    const [_, error] = await promisifier(this.videoRepo.deleteAll());
    if (error) {
      return err(new Error(error));
    }
    return ok(null);
    // const movieJob = await movieDbJobModel.deleteMany();
    // const tvShow = await tvShowModel.deleteMany();
  }
}
