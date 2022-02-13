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

  async findActive(params) {
    const data = await movieDbJobModel
      .find({
        status: "todo",
        type: params.type,
      })
      .populate({
        path: "video",
      });

    return data;
  }

  async create(id) {
    movieDbJobModel.create({
      video: id,
    });
  }

  async update(id, data) {
    return movieDbJobModel.findByIdAndUpdate(id, data);
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
