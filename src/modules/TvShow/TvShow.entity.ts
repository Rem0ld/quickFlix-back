import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Video } from "../Video/Video.entity";
import { WatchedTvShow } from "../WatchedTvShow/WatchedTvShow.entity";

@Entity()
export class TvShow extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "id_movie_db" })
  idMovieDb: string;

  @Index()
  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ name: "number_episode" })
  numberEpisode: number;

  @Column({ name: "number_season" })
  numberSeason: number;

  @Column()
  ongoing: boolean;

  @Column("text", { name: 'origin_country', array: true })
  originCountry: string[];

  @Column("text", { name: 'poster_path', array: true })
  posterPath: string[];

  @Column()
  resume: string;

  @Column()
  score: number;

  @Column("text", { array: true })
  genres: string[];

  @Column({
    name: "first_air_date",
    type: "timestamp",
  })
  firstAirDate: Date;

  @Column("text", { name: 'trailer_yt_code', array: true })
  trailerYtCode: string[];

  @Column({
    name: "average_length",
    type: "float",
  })
  averageLength: number;

  @OneToMany(() => Video, video => video.tvShowId)
  videos: Video[];

  @OneToMany(() => WatchedTvShow, watchedTvShow => watchedTvShow.tvShow)
  userWatchedTvShow: WatchedTvShow[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn(({ name: "updated_at" }))
  updatedAt: Date;
}
