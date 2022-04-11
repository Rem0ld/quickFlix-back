import { movieDbJobModel } from "../../schemas/MovieDbJob";
import { tvShowModel } from "../../schemas/TvShow";
import { videoModel } from "../../schemas/Video";
import { RequestBuilder, Video } from "../../types";
import { movieJobService } from "../MovieDbJob/MovieDbJob.service";


class VideoService {
  async findByFields({ name, episode, season }: { name: string, episode: string, season: string }) {
    const request: RequestBuilder = {};

    if (name) {
      request.name = new RegExp(`${name}`, "i");
    }
    if (episode) {
      request.episode = episode.toString();
    }
    if (season) {
      request.season = season.toString();
    }

    const videos = await videoModel.find(request);

    if (!videos) throw new Error("Cannot find video");

    return videos;
  }

  async patch(id: string, data: Partial<Video>) { }

  async create(data: Partial<Video>, params: { movieJob: boolean }) {
    const video = await videoModel.create(data);

    if (!video) {
      console.log("Something wrong has happened");
      console.log(video);
      return video;
    }

    if (params.movieJob) {
      await movieJobService.create({ id: video._id });
    }

    return video;
  }

  async deleteOneById(id: string) {
    const video = await videoModel.findByIdAndDelete(id);

    if (!video) return -1;

    await movieJobService.deletOneByVideoId(id);

    return video;
  }

  /**
   * Removes all videos, tvshows and movieJobs
   *
   * @returns the count of any removed
   */
  async deleteAll() {
    const videos = await videoModel.deleteMany();
    const movieJob = await movieDbJobModel.deleteMany();
    const tvShow = await tvShowModel.deleteMany();

    return {
      videos: videos.deletedCount,
      tvshows: tvShow.deletedCount,
      movieJobs: movieJob.deletedCount,
    };
  }
}

export default new VideoService();
