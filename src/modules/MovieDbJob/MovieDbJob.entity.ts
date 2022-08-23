import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { jobStatusType } from "../EncodingJob/EncodingJob.entity";
import { TvShow } from "../TvShow/TvShow.entity";
import { Video, VideoTypeEnum } from "../Video/Video.entity";

@Entity({ name: "movie_db_job" })
export class MovieDbJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ default: "todo" })
  status: jobStatusType;

  @Column("text", { array: true, nullable: true })
  errors: string[];

  @Column()
  type: VideoTypeEnum;

  @OneToOne(() => Video, video => video.id, {
    nullable: true,
    onDelete: "NO ACTION",
  })
  @JoinColumn({ name: "video_id" })
  video: Video;

  @OneToOne(() => TvShow, tvShow => tvShow.id, {
    nullable: true,
    onDelete: "NO ACTION",
  })
  @JoinColumn({ name: "tv_show_id" })
  tvShow: TvShow;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
