import { defaultLimit } from "../../config/defaultConfig";
import { RequestBuilder, TVideo } from "../../types";
import { VideoTypeEnum } from "./Video.entity";
import VideoRepository from "./Video.repository";
// import { movieJobService } from "../MovieDbJob/MovieDbJob.service";

export default class VideoService {
  videoRepo: VideoRepository;
  constructor(videoRepository: VideoRepository) {
    this.videoRepo = videoRepository;
  }

  async findById(id: string) {
    if (!id?.length) {
      throw new Error("missing ID");
    }

    const video = await this.videoRepo.findById(+id);

    return video;
  }

  async findAll(limit: number = defaultLimit, skip: number = 0) {
    // TODO: prepare db request in data layer
    try {
      const total = await this.videoRepo.getCount();
      const videos = await this.videoRepo.findAll(limit, skip);
      return { data: videos, total };
    } catch (error) {
      console.error(error);
      throw new Error("Cannot find all videos, probably due to reaching DB");
    }
  }

  async findByFields({
    name,
    episode,
    season,
    type,
    limit,
    skip,
  }: {
    name?: string;
    episode?: string;
    season?: string;
    type?: VideoTypeEnum[];
    limit: number;
    skip: number;
  }) {
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

    const videos = await this.videoRepo.findByFields(request, limit, skip);

    // if (!videos) throw new Error("Cannot find videos");

    return videos;
  }

  async patch(id: string, data: Partial<TVideo>) { }

  async create(data: Omit<TVideo, "id">, params: { movieJob: boolean }) {
    // TODO: validation to make sure video has everything needed
    if (!data?.name?.length) {
      throw new Error("invalid video object, missing name");
    }
    const video = await this.videoRepo.create(data);

    if (!video) {
      return video;
    }

    if (params.movieJob) {
      // await movieJobService.create({ id: video._id });
    }

    return video;
  }

  async deleteOneById(id: string) {
    if (!id.length) {
      throw new Error("Missing id");
    }

    const video = await this.videoRepo.delete(+id);

    // await movieJobService.deletOneByVideoId(id);

    return video;
  }

  // TODO: add some kind of validation here to be sure admin is doing it
  async deleteAll() {
    try {
      await this.videoRepo.deleteAll();
      return;
    } catch (error) {
      console.error(error);
      throw new Error("Cannot delete all from table video");
    }
    // const movieJob = await movieDbJobModel.deleteMany();
    // const tvShow = await tvShowModel.deleteMany();
  }
}