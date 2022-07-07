import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Video } from "./Video";
import { WatchedTvShow } from "./WatchedTvShow"

@Entity()
export class Watched {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "times_watched", type: "float" })
  timesWatched: number;

  @Column()
  finished: boolean;

  @ManyToOne(() => Video, video => video.userWatchedVideo)
  @JoinColumn({ name: "video_id" })
  video: Video;

  @ManyToOne(() => User, user => user.userWatchedVideo)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => WatchedTvShow, watchedTvShow => watchedTvShow.watched)
  userWatchedTvShow: WatchedTvShow[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Timestamp;

  @UpdateDateColumn(({ name: "updated_at" }))
  updatedAt: Date;
}