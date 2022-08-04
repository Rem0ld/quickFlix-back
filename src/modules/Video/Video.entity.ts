import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { TVideo } from "../../types";
import { TvShow } from "../TvShow/TvShow.entity";
import { Watched } from "../Watched/Watched.entity";
import { v4 as uuidv4 } from "uuid";

export enum VideoTypeEnum {
  MOVIE = "movie",
  TV = "tv",
  TRAILER = "trailer",
  TEASER = "teaser",
}

@Entity()
@Unique(["uuid", "name", "filename"])
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

  @Column({ unique: true })
  filename: string;

  @Column({
    length: 5,
  })
  ext: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  episode: number;

  @Column({ nullable: true })
  season: number;

  @Column({
    type: "date",
    nullable: true
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

  @Column({ nullable: true })
  score: number;

  @Column({ nullable: true })
  resume: string;

  @Column({
    type: "float",
    nullable: true
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

  @ManyToOne(type => Video, video => video.id, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "video_id_ref" })
  video: Video;

  @ManyToOne(type => TvShow, tvShow => tvShow.videos, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "tv_show_id" })
  tvShow: TvShow;

  @OneToMany(() => Watched, watched => watched.video)
  userWatchedVideo: Watched[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
