import { Brackets, createQueryBuilder, EntitySchema, QueryBuilder, SelectQueryBuilder } from "typeorm";
import { AppDataSource } from "../../data-source";
import { RequestBuilder, TVideo, VideoType } from "../../types";
import VideoRepository from "./Video.repository";
// import { movieJobService } from "../MovieDbJob/MovieDbJob.service";

function dynamicQueryBuilder<T>(args: { [k: string]: string }, entity: EntitySchema): SelectQueryBuilder<T> {
  const entityName = entity.options.name
  const builder = AppDataSource.createQueryBuilder(entity, entityName);
  for (const arg in args) {
    builder.where(`${entityName}.${arg}= :${arg}`, { [arg]: arg });
  }

  return builder;
}

class VideoService {
  videoRepo;
  constructor(videoRepository: VideoRepository) {
    this.videoRepo = videoRepository
  }

  async find({ limit = 20, skip = 0 }: { limit: number, skip: number }) {
    // TODO: prepare db request in data layer

    const videos = await this.videoRepo.findAll({ limit, skip })
    return videos
  }

  async findByFields({ name, episode, season, type }: { name?: string, episode?: string, season?: string, type?: VideoType[] }) {
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

    const videos = await this.videoRepo.find(request);

    if (!videos) throw new Error("Cannot find video");

    return videos;
  }

  async patch(id: string, data: Partial<TVideo>) { }

  async create(data: Partial<TVideo>, params: { movieJob: boolean }) {
    // TODO: validation to make sure video has everything needed
    if (!data?.name?.length) {
      throw new Error("invalid video object, missing name")
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
