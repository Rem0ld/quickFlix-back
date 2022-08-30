import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { MovieDbJob } from "./modules/MovieDbJob/MovieDbJob.entity";
import { TvShow } from "./modules/TvShow/TvShow.entity";
import { User } from "./modules/User/User.entity";
import { Video } from "./modules/Video/Video.entity";
import { Watched } from "./modules/Watched/Watched.entity";
import { WatchedTvShow } from "./modules/WatchedTvShow/WatchedTvShow.entity";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "0.0.0.0",
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  dropSchema: false,
  entities: [User, TvShow, Video, Watched, WatchedTvShow, MovieDbJob],
  migrations: [],
  subscribers: [],
});
