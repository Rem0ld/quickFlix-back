import { Response } from "express"

export type VideoType = "movie" | "tv" | "trailer" | "teaser"
export type TJobStatus = "todo" | "done" | "error"

export type Video = {
  id: string;
  idMovieDb?: string // id
  name: string
  basename: string
  filename: string
  ext: string
  location: string
  type: VideoType
  episode?: string | number,
  season?: string | number,
  year: Date,
  releaseDate: Date,
  score?: number,
  length?: number,
  resume?: string,
  director?: string[],
  writers?: string[],
  actors?: string[],
  trailer?: number[],
  genres: string[],
  subtitles: number[],
  trailerYtCode: string[],
  posterPath: string[],
  flags?: {
    wrongFormat: boolean,
    needSubtitles: boolean,
  },
}

export type RequestBuilder = {
  name?: RegExp;
  episode?: string;
  season?: string;
  type?: VideoType[];
}

export type EpisodeTvShow = {
  number: string | number;
  ref: String;
}

export type SeasonTvShow = {
  number: string | number;
  episodes: EpisodeTvShow[]
}

export type TvShow = {
  id: string;
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

export type Watched = {
  id: string;
  timeWatched: number;
  length?: number;
  finished: boolean;
  stoppedAt?: number;
  video: number;
  user: number;
}

export type WatchedTvShow = {
  id: string;
  tvShow: number;
  user: number;
}

export type TRole = 'admin' | 'simple'
export type TUser = {
  id: string;
  pseudo: string;
  email: string;
  password: string;
  role: TRole
}

export type Subtitle = {
  id: string;
  name: string;
  ext: string;
  path: string;
}

export type MovieDbJob = {
  id: string;
  video: Video;
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
  id: string;
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
