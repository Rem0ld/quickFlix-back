import "reflect-metadata"
import { DataSource } from "typeorm"
import { TvShow } from "./entity/TvShow"
import { User } from "./entity/User"
import { Video } from "./entity/Video"
import { Watched } from "./entity/Watched"
import { WatchedTvShow } from "./entity/WatchedTvShow"

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
