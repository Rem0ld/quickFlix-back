import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { jobStatusType } from "../EncodingJob/EncodingJob.entity";
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

  @Column({ name: "video_id", nullable: true })
  videoId: number;

  @Column({ name: "tv_show_id", nullable: true })
  tvShowId: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
