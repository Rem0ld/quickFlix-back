import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  JoinColumn,
} from "typeorm";
import { Video } from "../Video/Video.entity";

export enum jobStatusType {
  TODO = "todo",
  DONE = "done",
  ERROR = "error",
}

export enum encodingType {
  AUDIO = "audio",
  VIDEO = "video",
}

@Entity()
export class EncodingJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ default: jobStatusType.TODO })
  status: jobStatusType;

  @Index()
  @Column()
  type: encodingType;

  @Column()
  path: string;

  @Column({ array: true })
  errors: string[];

  @ManyToOne(() => Video, video => video.id)
  @JoinColumn({ name: "video_id" })
  video: Video;
}
