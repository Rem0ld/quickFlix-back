import { Response } from "express"
import { Video, VideoTypeEnum } from "./modules/Video/Video.entity";
import { TvShow } from "./modules/TvShow/TvShow.entity";
import { Watched } from "./modules/Watched/Watched.entity";

export type VideoType = "movie" | "tv" | "trailer" | "teaser"
export type TJobStatus = "todo" | "done" | "error"

export type TVideo = {
  id: number;
  uuid: string;
  idMovieDb?: string // id
  name: string
  basename: string
  filename: string
  ext: string
  location: string
  type: VideoTypeEnum,
  episode?: number,
  season?: number,
  year: Date,
  releaseDate: Date,
  score?: number,
  length?: number,
  resume?: string,
  directors?: string[],
  writers?: string[],
  actors?: string[],
  trailer?: Video[],
  genres: string[],
  trailerYtCode: string[],
  posterPath: string[],
  tvShow?: TvShow;
  video?: Video;
  userWatchedVideo?: Watched[];
  createdAt?: Date;
  updatedAt?: Date;
  // flags?: {
  //   wrongFormat: boolean,
  //   needSubtitles: boolean,
  // },
}

export type RequestBuilder = {
  name?: string;
  episode?: number;
  season?: number;
  type?: VideoTypeEnum[];
}

export type EpisodeTvShow = {
  number: string | number;
  ref: String;
}

export type SeasonTvShow = {
  number: string | number;
  episodes: EpisodeTvShow[]
}

export type TTvShow = {
  id: number;
  idMovieDb?: string // id
  name: string
  location: string
  numberSeason: number;
  numberEpisode: number;
  ongoing: boolean;
  originCountry: string[];
  trailerYtCode: string[];
  posterPath: string[];
  genres: string[];
  resume?: string;
  score?: number;
  firstAirDate: Date;
  seasons: SeasonTvShow[];
  averageLength?: number;
}

export type TWatched = {
  id: number;
  timesWatched: number;
  length?: number;
  finished: boolean;
  stoppedAt?: number;
  video: number;
  user: number;
}

export type WatchedTvShow = {
  id: number;
  tvShow: number;
  user: number;
}

export type TRole = 'admin' | 'simple'
export type TUser = {
  id: number;
  pseudo: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export type Subtitle = {
  id: number;
  name: string;
  ext: string;
  path: string;
}

export type MovieDbJob = {
  id: number;
  video: TVideo;
  status: TJobStatus;
  error: string[];
  type: VideoType
}

export type Pagination = {
  limit: number;
  skip: number;
  populate?: boolean;
}

export type PaginatedResponse<T> = {
  total: number;
  limit: number;
  skip: number;
  data: T;

}

export type ExtSubtitle = "srt" | "vtt" | "sfv"
export type ExtVideo = "avi" | "mp4" | "mkv"

export type VideoMaker = {
  countVideo: number;
  movieJob: number;
  countTvShowCreated: number;
  countUpdatedTvShow: number;
}

export type EncodingJob = {
  id: number;
  videoId: number;
  pathname: string;
  status: TJobStatus;
  error: string[];
  type: "audio" | "video";
};

/* NOT WORKING */
// Helpers
type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
// type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

// Generic typed response, we omit 'json' and we add a new json method with the desired parameter type
type TypedResponse<T> = Omit<Response, 'json'> & { json(data: T): Response };
// An example of a typed response
type AppResponse<T> = TypedResponse<{
  total: number;
  limit: number;
  skip: number;
  data: T;
}>
