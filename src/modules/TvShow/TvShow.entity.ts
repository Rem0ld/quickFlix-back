import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TTvShow } from "../../types";
import { MovieDbJob } from "../MovieDbJob/MovieDbJob.entity";
import { Video } from "../Video/Video.entity";
import { WatchedTvShow } from "../WatchedTvShow/WatchedTvShow.entity";

@Entity({ name: "tv_show" })
export class TvShow implements TTvShow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "id_movie_db", nullable: true })
  idMovieDb: string;

  @Index()
  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ name: "number_episode", nullable: true })
  numberEpisode: number;

  @Column({ name: "number_season", nullable: true })
  numberSeason: number;

  @Column({ nullable: true })
  ongoing: boolean;

  @Column("text", { name: "origin_country", array: true, nullable: true })
  originCountry: string[];

  @Column("text", { name: "poster_path", array: true, nullable: true })
  posterPath: string[];

  @Column({ nullable: true })
  resume: string;

  @Column({ nullable: true })
  score: number;

  @Column("text", { array: true, nullable: true })
  genres: string[];

  @Column({
    name: "first_air_date",
    type: "timestamp",
    nullable: true,
  })
  firstAirDate: Date;

  @Column("text", { name: "trailer_yt_code", array: true, nullable: true })
  trailerYtCode: string[];

  @Column({
    name: "average_length",
    type: "float",
    nullable: true,
  })
  averageLength: number;

  @OneToMany(() => Video, video => video.tvShow)
  videos: Video[];

  @OneToMany(() => WatchedTvShow, watchedTvShow => watchedTvShow.tvShow)
  userWatchedTvShow: WatchedTvShow[];

  @ManyToOne(type => MovieDbJob, movieDbJob => movieDbJob.tvShowId, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "movie_db_job_id" })
  movieDbJob: MovieDbJob;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
