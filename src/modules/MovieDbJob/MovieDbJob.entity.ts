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

@Entity()
export class MovieDbJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  status: jobStatusType;

  @Column({ array: true })
  errors: string[];

  @Column()
  type: VideoTypeEnum;

  @ManyToOne(() => Video, video => video.id)
  @JoinColumn({ name: "video_id" })
  video: Video;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
