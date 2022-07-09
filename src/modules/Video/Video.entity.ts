import {
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
import { TVideo } from "../../types";
import { TvShow } from "../TvShow/TvShow.entity";
import { Watched } from "../Watched/Watched.entity";

export enum VideoTypeEnum {
  MOVIE = "movie",
  TV = "tv",
  TRAILER = "trailer",
  TEASER = "teaser",
}

@Entity()
export class Video implements TVideo {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  name: string;

  @Index()
  @Column()
  basename: string;

  @Column()
  filename: string;

  @Column({
    length: 5,
  })
  ext: string;

  @Column()
  location: string;

  @Column({ type: "int2" })
  episode: number;

  @Column({ type: "int2" })
  season: number;

  @Column({
    type: "date",
  })
  year: Date;

  @Column({ name: "release_date" })
  releaseDate: Date;

  @Index()
  @Column({
    type: "enum",
    enum: VideoTypeEnum,
  })
  type: VideoTypeEnum;

  @Column()
  score: number;

  @Column()
  resume: string;

  @Column({
    type: "float",
  })
  length: number;

  @Column({ name: "id_movie_db" })
  idMovieDb: string;

  @Column("text", { array: true })
  directors: string[];

  @Column("text", { array: true })
  writers: string[];

  @Column("text", { array: true })
  actors: string[];


  @Column("text", { array: true })
  genres: string[];

  @Column("text", { name: "trailer_yt_code", array: true })
  trailerYtCode: string[];

  @Column("text", { name: "poster_path", array: true })
  posterPath: string[];

  @ManyToOne(type => Video, video => video.id)
  @JoinColumn({ name: "video_id_ref" })
  videoIdRef: Video;

  @ManyToOne(type => TvShow, tvShow => tvShow.videos)
  @JoinColumn({ name: "tv_show_id" })
  tvShowId: TvShow;

  @OneToMany(() => Watched, watched => watched.video)
  userWatchedVideo: Watched[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
