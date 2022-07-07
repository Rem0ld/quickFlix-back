import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Watched } from './Watched'
import { TvShow } from './TvShow'
import { User } from './User'

@Entity()
export class WatchedTvShow {

  @PrimaryColumn()
  id: number;

  @ManyToOne(() => Watched, watched => watched.userWatchedTvShow)
  @JoinColumn({ name: "watched_id" })
  watched: Watched;

  @ManyToOne(() => TvShow, tvshow => tvshow.userWatchedTvShow)
  @JoinColumn({ name: 'tv_show_id' })
  tvShow: TvShow;

  @ManyToOne(() => User, user => user.userWatchedTvShow)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn(({ name: "updated_at" }))
  updatedAt: Date;
}
