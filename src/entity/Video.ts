import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TvShow } from "./TvShow";

export enum VideoType {
  MOVIE = "movie",
  TV = "tv",
  TRAILER = "trailer",
  TEASER = "teaser",
}

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

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

  @Column()
  episode: string;

  @Column()
  season: string;

  @Column({
    type: "date",
  })
  year: Date;

  @Column()
  release_date: Date;

  @Column({
    type: "enum",
    enum: VideoType,
  })
  type: VideoType;

  @Column()
  score: number;

  @Column()
  resume: string;

  @Column({
    type: "float",
  })
  length: number;

  @Column()
  id_movie_db: string;

  @Column()
  directors: string[];

  @Column()
  writers: string[];

  @Column()
  actors: string[];

  @OneToMany(() => Video, video => video.id)
  trailer: Video[];

  @Column()
  genres: string[];

  @Column()
  trailer_yt_code: string[];

  @Column()
  poster_path: string[];

  @ManyToOne(() => TvShow, tvShow => tvShow.id)
  tv_show: TvShow;
}
