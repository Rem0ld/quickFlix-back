import { videoModel } from "../../schemas/Video";

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

    console.log({ request });

    const videos = await videoModel.find(request);

    console.log({ videos });
    if (!videos) throw new Error("Cannot find video");

    return videos;
  }
}

export default new VideoService();
