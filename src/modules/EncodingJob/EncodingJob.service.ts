import { EncodingJob, Pagination } from "../../types";

class EncodingJobService {
  async find(): Promise<EncodingJob[]> {}

  async findByType(): Promise<EncodingJob[]> {}

  // async findById(id: string): Promise<MovieDbJob | undefined | null> {
  //   return movieDbJobModel.findById(id);
  // }

  // async findByVideoId(id: string): Promise<MovieDbJob | undefined | null> {
  //   return movieDbJobModel.findOne({
  //     video: id,
  //   });
  // }

  // async findActive(params: { type: VideoType }): Promise<MovieDbJob[] | undefined | null> {
  //   const data = await movieDbJobModel
  //     .find({
  //       status: "todo",
  //       type: params.type,
  //     })
  //     .populate({
  //       path: "video",
  //     });

  //   return data;
  // }

  // async create(id: string): Promise<MovieDbJob> {
  //   return movieDbJobModel.create({
  //     video: id,
  //   });
  // }

  // async update(id: string, data: Partial<MovieDbJob>): Promise<MovieDbJob | null | undefined> {
  //   return movieDbJobModel.findByIdAndUpdate(id, data);
  // }

  // async deleteOneById(id: string): Promise<MovieDbJob | false | null> {
  //   const movieJob = movieDbJobModel.findByIdAndDelete(id);

  //   if (movieJob === null) {
  //     console.error("cannot find movie job");
  //     return false;
  //   }

  //   return movieJob;
  // }

  // async deletOneByVideoId(id: string): Promise<MovieDbJob | false | null> {
  //   const movieJob = movieDbJobModel.findOneAndDelete({
  //     video: id,
  //   });

  //   if (!movieJob) {
  //     console.error("cannot find movie job");
  //     return false;
  //   }

  //   return movieJob;
  // }
}

export const encodingJobService = new EncodingJobService();
