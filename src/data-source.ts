import "reflect-metadata"
import { DataSource } from "typeorm"
import { TvShow } from "./modules/TvShow/TvShow.entity"
import { User } from "./modules/User/User.entity"
import { Video } from "./modules/Video/Video.entity"
import { Watched } from "./modules/Watched/Watched.entity"
import { WatchedTvShow } from "./modules/WatchedTvShow/WatchedTvShow.entity"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "0.0.0.0",
    port: 5432,
    username: "docker",
    password: "example",
    database: "quickflix_db",
    synchronize: false,
    logging: false,
    entities: [User, TvShow, Video, Watched, WatchedTvShow],
    migrations: [],
    subscribers: [],
})
