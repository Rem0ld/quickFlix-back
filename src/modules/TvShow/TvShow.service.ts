import { movieDbJobModel } from "../../schemas/MovieDbJob";
import { tvShowModel } from "../../schemas/TvShow";
import { Pagination, TvShow } from "../../types";

class TvShowService {
  async findAll(populate: boolean) {
    let data: TvShow[] = []

    if (populate) {
      data = await tvShowModel.find().populate({
        path: "seasons",
        populate: {
          path: "episodes",
          populate: {
            path: "ref",
          },
        },
      });
    } else {
      data = await tvShowModel.find()
    }

    return data;
  }

  async find({ limit, skip, populate }: Pagination): Promise<{ data: TvShow[], count: number }> {
    let data: TvShow[] = [];
    const count = await tvShowModel.countDocuments();

    if (populate) {
      data = await tvShowModel
        .find()
        .skip(+skip)
        .limit(+limit)
        .populate({
          path: "seasons",
          populate: {
            path: "episodes",
            populate: {
              path: "ref",
            },
          },
        });
    } else {
      data = await tvShowModel
        .find()
        .skip(+skip)
        .limit(+limit);
    }

    return { data, count };

  }

  async findByName(name: string): Promise<TvShow | null> {
    const re = new RegExp(`${name}`, "i");
    const result = await tvShowModel.findOne({ name: re });

    return result;
  }

  async create(data: Partial<TvShow>, params: { movieJob?: boolean, id?: string }) {
    const tvShow: TvShow | null = await tvShowModel.create(data);

    if (!tvShow) {
      console.log("Something wrong has happened");
      console.log(tvShow);
      // This should be an error
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

  async deleteOneById(id: string) { }
}

export default new TvShowService();
