import { Video, VideoTypeEnum } from "../../modules/Video/Video.entity";
import { TVideo, RequestBuilder } from "../../types";
import { v4 as uuidv4 } from "uuid";

export const mockVideo: Omit<TVideo, "id"> = {
  uuid: uuidv4(),
  name: "game of thrones",
  basename: "game of thrones",
  location: "useretcgaime",
  ext: "mp4",
  filename: "game of thrones",
  type: VideoTypeEnum.TV,
  episode: 1,
  season: 1,
  year: new Date("02/14/2003"),
  releaseDate: new Date("02/14/2003"),
  genres: ["action"],
  trailerYtCode: [],
  posterPath: [],
};

export const mockVideo2: Omit<TVideo, "id"> = {
  uuid: uuidv4(),
  name: "game of thrones",
  basename: "game of thrones",
  location: "useretcgaime/etc/jesuisla",
  ext: "mp4",
  filename: "game of thrones",
  type: VideoTypeEnum.TV,
  episode: 2,
  season: 1,
  year: new Date("02/14/2003"),
  releaseDate: new Date("02/24/2003"),
  genres: ["action"],
  trailerYtCode: [],
  posterPath: [],
};

export const mockUpdateVideo: Partial<Video> = {
  basename: "game",
};

export const mockRequest: RequestBuilder = {
  name: "game",
  episode: 1,
  season: 1,
  type: [VideoTypeEnum.TV, VideoTypeEnum.MOVIE],
};

export const mockRequestEpisode: RequestBuilder = {
  episode: 1,
};