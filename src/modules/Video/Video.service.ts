import { EntityTarget, SelectQueryBuilder } from "typeorm";
import { isArray } from "util";
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
    if (!id.length) {
      throw new Error("missing Id");
    }

    const video = await this.videoRepo.findById(parseInt(id));

    return video;
  }

  async find({
    limit = defaultLimit,
    skip = 0,
  }: {
    limit: number;
    skip: number;
  }) {
    // TODO: prepare db request in data layer

    const videos = await this.videoRepo.findAll({ limit, skip });
    return videos;
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

    if (!videos) throw new Error("Cannot find videos");

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

  // async deleteOneById(id: string) {
  //   const video = await videoModel.findByIdAndDelete(id);

  //   if (!video) return -1;

  //   await movieJobService.deletOneByVideoId(id);

  //   return video;
  // }

  // /**
  //  * Removes all videos, tvshows and movieJobs
  //  *
  //  * @returns the count of any removed
  //  */
  // async deleteAll() {
  //   const videos = await videoModel.deleteMany();
  //   const movieJob = await movieDbJobModel.deleteMany();
  //   const tvShow = await tvShowModel.deleteMany();

  //   return {
  //     videos: videos.deletedCount,
  //     tvshows: tvShow.deletedCount,
  //     movieJobs: movieJob.deletedCount,
  //   };
  // }
}

export default VideoService;
