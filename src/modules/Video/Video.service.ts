import { EntityTarget, SelectQueryBuilder } from "typeorm";
import { defaultLimit } from "../../config/defaultConfig";
import { AppDataSource } from "../../data-source";
import { RequestBuilder, TVideo, VideoType } from "../../types";
import { VideoTypeEnum } from "./Video.entity";
import VideoRepository from "./Video.repository";
// import { movieJobService } from "../MovieDbJob/MovieDbJob.service";

export function dynamicQueryBuilder<T>(
  data: RequestBuilder,
  entity: EntityTarget<T>,
  entityName: string
): SelectQueryBuilder<T> {
  const builder = AppDataSource.createQueryBuilder(entity, entityName);
  for (const el in data) {
    if (!Array.isArray(data[el])) {
      builder.andWhere(`${entityName}.${el} LIKE :${el}`, {
        [el]: `${data[el]}%`,
      });
    } else {
      builder.andWhere(`${entityName}.${el} IN (:...${el})`, {
        [el]: data[el],
      });
    }
  }

  return builder;
}

class VideoService {
  videoRepo: VideoRepository;
  constructor(videoRepository: VideoRepository) {
    this.videoRepo = videoRepository;
  }

  async findById(id: string) {
    if (!id?.length) {
      throw new Error("missing Id");
    }

    const video = await this.videoRepo.findById(parseInt(id));

    return video;
  }

  async find(limit: number = defaultLimit, skip: number = 0) {
    // TODO: prepare db request in data layer
    try {
      const total = await this.videoRepo.getCount();
      const videos = await this.videoRepo.findAll({ limit, skip });
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
      request.episode = parseInt(episode);
    }
    if (season) {
      request.season = parseInt(season);
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

    const video = await this.videoRepo.delete(parseInt(id));

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

export default VideoService;
