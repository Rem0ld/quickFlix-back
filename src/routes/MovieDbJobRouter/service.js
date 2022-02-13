import { movieDbJobModel } from "../../schemas/MovieDbJob";

class MovieDbJobService {
  async find({ limit, skip, populate }) {
    if (populate) {
      const movieJobs = await movieDbJobModel
        .find()
        .populate({
          path: "video",
        })
        .limit(limit)
        .skip(skip);

      return movieJobs;
    }
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

  async findActive() {
    return movieDbJobModel.find({
      status: "todo",
    });
  }

  async create(id) {
    movieDbJobModel.create({
      video: id,
    });
  }

  async deleteOneById(id) {
    const movieJob = movieDbJobModel.findByIdAndDelete(id);

    if (!movieJob) {
      console.error("cannot find movie job");
      return -1;
    }

    return movieJob;
  }

  async deletOneByVideoId(id) {
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
