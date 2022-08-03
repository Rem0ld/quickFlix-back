import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Watched } from "../Watched/Watched.entity";
import { TvShow } from "../TvShow/TvShow.entity";
import { User } from "../User/User.entity";

@Entity()
export class WatchedTvShow {
  @PrimaryColumn()
  id: number;

  @ManyToOne(() => Watched, watched => watched.userWatchedTvShow, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "watched_id" })
  watched: Watched;

  @ManyToOne(() => TvShow, tvshow => tvshow.userWatchedTvShow, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "tv_show_id" })
  tvShow: TvShow;

  @ManyToOne(() => User, user => user.userWatchedTvShow, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
