import { movieDbJobModel } from "../../schemas/MovieDbJob";
import { tvShowModel } from "../../schemas/TvShow";

class TvShowService {
  async find({ limit, skip, populate }) {}

  async findByName(name) {
    const re = new RegExp(`${name}`, "i");
    const result = await tvShowModel.findOne({ name: re });

    return result;
  }

  async create(data, params) {
    const tvShow = await tvShowModel.create(data);

    if (!tvShow) {
      // This should be an error
      console.log("Something wrong has happened");
      console.log(tvShow);
      return tvShow;
    }

    if (params.movieJob) {
      await movieDbJobModel.create({
        video: params.id,
        type: "tv",
      });
    }

    return tvShow;
  }

  async deleteOneById(id) {}
}

export default new TvShowService();
