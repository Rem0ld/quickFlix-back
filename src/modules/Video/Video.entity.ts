import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { TVideo } from "../../types";
import { TvShow } from "../TvShow/TvShow.entity";
import { Watched } from "../Watched/Watched.entity";
import { v4 as uuidv4 } from "uuid";
import { MovieDbJob } from "../MovieDbJob/MovieDbJob.entity";

export enum VideoTypeEnum {
  MOVIE = "movie",
  TV = "tv",
  TRAILER = "trailer",
  TEASER = "teaser",
}

@Entity()
@Unique(["name"])
export class Video implements TVideo {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ default: uuidv4() })
  uuid: string;

  @Index()
  @Column()
  name: string;

  @Index()
  @Column()
  basename: string;

  @Column()
  filename: string;

  @Column()
  ext: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  episode: number;

  @Column({ nullable: true })
  season: number;

  @Column({
    type: "date",
    nullable: true,
  })
  year: Date;

  @Column({ name: "release_date", nullable: true })
  releaseDate: Date;

  @Index()
  @Column({
    type: "enum",
    enum: VideoTypeEnum,
  })
  type: VideoTypeEnum;

  @Column({ type: "real", nullable: true })
  score: number;

  @Column({ nullable: true })
  resume: string;

  @Column({
    type: "float",
    nullable: true,
  })
  length: number;

  @Column({ name: "id_movie_db", nullable: true })
  idMovieDb: string;

  @Column("text", { array: true, nullable: true })
  directors: string[];

  @Column("text", { array: true, nullable: true })
  writers: string[];

  @Column("text", { array: true, nullable: true })
  actors: string[];

  @Column("text", { array: true, nullable: true })
  genres: string[];

  @Column("text", { name: "trailer_yt_code", array: true, nullable: true })
  trailerYtCode: string[];

  @Column("text", { name: "poster_path", array: true, nullable: true })
  posterPath: string[];

  @ManyToOne(() => Video, video => video.id, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "video_id_ref" })
  video: Video;

  @ManyToOne(() => TvShow, tvShow => tvShow.videos, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "tv_show_id" })
  tvShow: TvShow;

  @OneToOne(() => MovieDbJob, movieDbJob => movieDbJob.video, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "movie_db_job_id" })
  movieDbJob: MovieDbJob;

  @OneToMany(() => Watched, watched => watched.video)
  userWatchedVideo: Watched[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
