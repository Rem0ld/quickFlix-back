import { movieDbJobModel } from "../../schemas/MovieDbJob";
import { videoModel } from "../../schemas/Video";
import MovieDbJobService from "../MovieDbJobRouter/service";

class VideoService {
  async findByFields({ name, episode, season }) {
    const request = {};

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

  async patch(video, data) {
    try {
      const video = await this.findByFields(video);
    } catch (error) {
      console.log(error);
    }
  }

  async create(data, params) {
    const video = await videoModel.create(data);

    if (!video) return new Error("Something wrong has happened");

    if (params.movieJob) {
      await MovieDbJobService.create(video._id);
    }

    return video;
  }

  async deleteOneById(id) {
    const video = await videoModel.findByIdAndDelete(id);

    if (!video) return -1;

    const movieJob = await MovieDbJobService.deleteOneById(id);

    return video;
  }

  /**
   * @returns number of videos deleted
   */
  async deleteAll() {
    const videos = await videoModel.deleteMany();
    await movieDbJobModel.deleteMany();

    return videos.deletedCount;
  }
}

export default new VideoService();
