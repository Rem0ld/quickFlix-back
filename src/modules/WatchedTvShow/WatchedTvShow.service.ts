import { watchedTvShowModel } from "../../schemas/WatchedTvShow";
import { WatchedTvShow } from "../../types";
class WatchedTvShowService {
  async create(data: Partial<WatchedTvShow>) {
    return watchedTvShowModel.create(data);
  }

  async update(
    name: string,
    data: { videoId: string; watchedId: string }
  ) {
    const tvShow = await watchedTvShowModel.findOne({ tvShow: name });

    if (!tvShow) {
      console.log("does not exist yet, creation watchedtvshow");
      return this.create({
        tvShow: name,
        videos: [
          {
            ...data
          },
        ],
      });
    }

    const exists = tvShow?.videos.findIndex(video => {
      return video.videoId.toString() === data.videoId;
    });

    console.log({ exists })
    console.log(data)

    if (exists === -1) {
      tvShow.videos = [
        ...tvShow.videos,
        {
          ...data
        }
      ]
      const result = await tvShow.save();
      return result;
      // return watchedTvShowModel.updateOne(
      //   { tvShow: name },
      //   {
      //     videos: [
      //       ...tvShow.videos,
      //       {
      //         videoId: data.videoId,
      //         watchedId: data.watchedId,
      //       },
      //     ],
      //   }
      // );
    }

    return undefined;
  }

}

export default new WatchedTvShowService();
