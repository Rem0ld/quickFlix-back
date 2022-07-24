import { DeepPartial, UpdateResult } from "typeorm";
import { defaultLimit } from "../../config/defaultConfig";
import MissingDataPayloadError from "../../services/Error";
import { promisifier } from "../../services/promisifier";
import { TResultService, RequestBuilder, TVideo } from "../../types";
import { Video, VideoTypeEnum } from "./Video.entity";
import VideoRepository from "./Video.repository";

// import { movieJobService } from "../MovieDbJob/MovieDbJob.service";

export default class VideoService {
  videoRepo: VideoRepository;
  constructor(videoRepository: VideoRepository) {
    this.videoRepo = videoRepository;
  }

  async findById(id: string): Promise<Video | null> {
    if (!id.length) {
      throw new MissingDataPayloadError("id")
    }

    const [result, error] = await promisifier(this.videoRepo.findById(+id));
    if (error) {
      throw new Error(error)
    }

    return result;
  }

  async findAll(
    limit: number = defaultLimit,
    skip: number = 0
  ): Promise<TResultService<Video>> {
    // TODO: prepare db request in data layer
    const total = await this.videoRepo.getCount();
    const [result, error] = await promisifier(this.videoRepo.findAll(limit, skip))
    if (error) {
      throw new Error(error)
    }
    return { data: result, total };
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
  }): Promise<TResultService<Video>> {
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
    const [result, error] = await promisifier(this.videoRepo.findByFields(request, limit, skip))
    if (error) {
      throw new Error(error)
    }

    return { total, data: result };

    // if (!videos) throw new Error("Cannot find videos");
  }

  async patch(id: string, data: Partial<Video>): Promise<Video> {
    if (!id.length) {
      throw new MissingDataPayloadError("id")
    }

    if (!Object.keys(data).length) {
      throw new MissingDataPayloadError()
    }

    const [result, error] = await promisifier(this.videoRepo.update(+id, data))
    if (error) {
      throw new Error(error)
    }

    return result;
  }

  async create(data: DeepPartial<Video>, params: { movieJob: boolean }) {
    // TODO: validation to make sure video has everything needed
    if (!data?.name?.length) {
      throw new MissingDataPayloadError("name")
    }
    const [result, error] = await promisifier(this.videoRepo.create(data));
    if (error) {
      throw new Error(error)
    }

    if (params.movieJob) {
      // await movieJobService.create({ id: video._id });
    }

    return result;
  }

  async deleteOneById(id: string) {
    if (!id.length) {
      throw new MissingDataPayloadError("id")
    }

    const [result, error] = await promisifier(this.videoRepo.delete(+id));
    if (error) {
      throw new Error(error)
    }

    // await movieJobService.deletOneByVideoId(id);

    return result;
  }

  // TODO: add some kind of validation here to be sure admin is doing it
  async deleteAll() {
    const [_, error] = await promisifier(this.videoRepo.deleteAll())
    if (error) {
      throw new Error(error)
    }
    return;
    // const movieJob = await movieDbJobModel.deleteMany();
    // const tvShow = await tvShowModel.deleteMany();
  }
}
