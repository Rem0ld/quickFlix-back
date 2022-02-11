import { movieDbJobModel } from "../../schemas/MovieDbJob";

class MovieDbJobService {
  async find({ limit, skip }) {
    return movieDbJobModel.find().limit(limit).skip(skip);
  }

  async findById(id) {
    return movieDbJobModel.findById(id);
  }

  async findByVideoId(id) {
    return movieDbJobModel.findOne({
      video: id,
    });
  }

  async create(id) {
    movieDbJobModel.create({
      video: id,
      status: "todo",
    });
  }

  async deleteOneById(id) {
    const movieJob = movieDbJobModel.findOneAndDelete({
      video: id,
    });

    if (!movieJob) {
      console.error("cannot find movie job");
      return -1;
    }

    return movieJob;
  }
}

export default new MovieDbJobService();
