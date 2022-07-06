import { Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Video } from "./Video";

export class TvShow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_movie_db: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  number_episode: number;

  @Column()
  number_season: number;

  @Column()
  ongoing: boolean;

  @Column()
  origin_country: string[];

  @Column()
  poster_path: string[];

  @Column()
  resume: string;

  @Column()
  score: number;

  @Column()
  genres: string[];

  @Column({
    type: "timestamp"
  })
  first_air_date: Date

  @Column()
  trailer_yt_code: string[];

  @Column({
    type: "float"
  })
  average_length: number;

  @OneToMany(() => Video, video => video.id)
  videos: Video[];
}
