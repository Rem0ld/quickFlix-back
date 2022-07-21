import connection from "../../config/databases";
import { AppDataSource } from "../../data-source";
import { User } from "../../modules/User/User.entity";
import UserRepository from "../../modules/User/User.repository";
import UserService from "../../modules/User/User.service";
import { TUser } from "../../types";
import dotenv from "dotenv";
import VideoRepository from "../../modules/Video/Video.repository";
import VideoService from "../../modules/Video/Video.service";
import { TvShowRepository } from "../../modules/TvShow/TvShow.repository";
import TvShowService from "../../modules/TvShow/TvShow.service";
dotenv.config();

/**
 * Creates beforeAll connection and afterAll clean DB and close connection
 */
export function configJest() {
  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.clear();
    await connection.close();
  });
}

const userRepo = new UserRepository(AppDataSource.manager);
export const userService = new UserService(userRepo);

const videoRepo = new VideoRepository(AppDataSource.manager);
export const videoService = new VideoService(videoRepo);

const tvShowRepo = new TvShowRepository(AppDataSource.manager);
export const tvShowService = new TvShowService(tvShowRepo);
