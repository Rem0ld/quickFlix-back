import { Response } from "express";
import { Video, VideoTypeEnum } from "./modules/Video/Video.entity";
import { TvShow } from "./modules/TvShow/TvShow.entity";
import { Watched } from "./modules/Watched/Watched.entity";
import { DeepPartial, DeleteResult, UpdateResult } from "typeorm";
import { WatchedTvShow } from "./modules/WatchedTvShow/WatchedTvShow.entity";
import { User } from "./modules/User/User.entity";
import { UserDTO } from "./modules/User/User.dto";

export interface IReader<T> {
  getCount(): Promise<number>;
  findAll(limit: number, skip: number, id?: number): Promise<TResultService<T>>;
  findById(id: number): Promise<T>;
}

export interface IWriter<T> {
  create(data: DeepPartial<T>): Promise<T>;
  createMany(data: DeepPartial<T>[]): Promise<T[]>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<DeleteResult>;
}

export type BaseRepository<T> = IReader<T> & IWriter<T>;

export type Result<T, E> = [T?, E?];
export type TResultService<T> = {
  total: number;
  data: T[];
};

export type TUserWithToken = {
  user: UserDTO;
  token: string;
};

export type VideoType = "movie" | "tv" | "trailer" | "teaser";
export type TJobStatus = "todo" | "done" | "error";

export type TVideo = {
  id: number;
  uuid: string;
  idMovieDb?: string; // id
  name: string;
  basename: string;
  filename: string;
  ext: string;
  location: string;
  type: VideoTypeEnum;
  episode?: number;
  season?: number;
  year: Date;
  releaseDate: Date;
  score?: number;
  length?: number;
  resume?: string;
  directors?: string[];
  writers?: string[];
  actors?: string[];
  trailer?: Video[];
  genres: string[];
  trailerYtCode: string[];
  posterPath: string[];
  tvShow?: TvShow;
  video?: Video;
  userWatchedVideo?: Watched[];
  createdAt?: Date;
  updatedAt?: Date;
  // flags?: {
  //   wrongFormat: boolean,
  //   needSubtitles: boolean,
  // },
};

export type RequestBuilder = {
  name?: string;
  episode?: number;
  season?: number;
  type?: VideoTypeEnum[];
};

export type EpisodeTvShow = {
  number: string | number;
  ref: String;
};

export type SeasonTvShow = {
  number: string | number;
  episodes: EpisodeTvShow[];
};

export type TTvShow = {
  id: number;
  idMovieDb?: string; // id
  name: string;
  location: string;
  numberSeason: number;
  numberEpisode: number;
  ongoing: boolean;
  originCountry?: string[];
  trailerYtCode?: string[];
  posterPath?: string[];
  genres: string[];
  resume?: string;
  score?: number;
  firstAirDate: Date;
  averageLength?: number;
  videos?: Video[];
  userWatchedTvShow?: WatchedTvShow[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type TWatched = {
  id: number;
  timesWatched: number;
  length?: number;
  finished: boolean;
  stoppedAt?: number;
  video: Video;
  user: User;
};

export type TWatchedTvShow = {
  id: number;
  tvShow: TvShow;
  user: User;
  watched: Watched;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TRole = "admin" | "simple";
export type TUser = {
  id: number;
  pseudo: string;
  email: string;
  password: string;
  isAdmin: boolean;
};

export type TSubtitle = {
  id: number;
  name: string;
  ext: string;
  path: string;
};

export type TMovieDbJob = {
  id: number;
  video: TVideo;
  status: TJobStatus;
  error?: string[];
  type: VideoType;
};

export type Pagination = {
  limit: number;
  skip: number;
  populate?: boolean;
};

export type PaginatedResponse<T> = {
  total: number;
  limit: number;
  skip: number;
  data: T;
};

export type ExtSubtitle = "srt" | "vtt" | "sfv";
export type ExtVideo = "avi" | "mp4" | "mkv";

export type TVideoMaker = {
  countVideo: number;
  movieJob: number;
  countTvShowCreated: number;
  countUpdatedTvShow: number;
};

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
type Diff<T extends string, U extends string> = ({ [P in T]: P } & {
  [P in U]: never;
} & { [x: string]: never })[T];
// type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

// Generic typed response, we omit 'json' and we add a new json method with the desired parameter type
type TypedResponse<T> = Omit<Response, "json"> & { json(data: T): Response };

// An example of a typed response
type AppResponse<T> = TypedResponse<{
  total: number;
  limit: number;
  skip: number;
  data: T;
}>;

// Tried to dynamically create repository but not working
// class Base<T> implements BaseRepository<T> {
//   constructor(
//     private manager: EntityManager,
//     private entity: EntitySchema<T>
//   ) {}

//   findAll(limit: number, skip: number): Promise<T[]> {
//     return this.manager
//       .createQueryBuilder<T>(this.entity, this.entity.options.name)
//       .take(limit)
//       .skip(skip)
//       .getMany();
//   }

//   findById(id: number): Promise<T> {
//     return this.manager.findOneBy(this.entity, { id });
//   }

//   create(data: Omit<T, "id">): Promise<T> {}

//   createMany(data: Omit<T, "id">[]): Promise<T[]> {}

//   update(id: number, data: Partial<T>): Promise<UpdateResult> {}

//   delete(id: number): Promise<DeleteResult> {}
// }
