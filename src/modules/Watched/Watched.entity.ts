import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../User/User.entity";
import { Video } from "../Video/Video.entity";
import { WatchedTvShow } from "../WatchedTvShow/WatchedTvShow.entity";

@Entity()
export class Watched {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "times_watched", type: "float" })
  timesWatched: number;

  @Column({ default: false })
  finished: boolean;

  @ManyToOne(() => Video, video => video.userWatchedVideo, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "video_id" })
  video: Video;

  @ManyToOne(() => User, user => user.userWatchedVideo, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => WatchedTvShow, watchedTvShow => watchedTvShow.watched)
  userWatchedTvShow: WatchedTvShow[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
