import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from "typeorm";
import { Watched } from "../Watched/Watched.entity";
import { WatchedTvShow } from "../WatchedTvShow/WatchedTvShow.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ unique: true })
    pseudo: string;

    @Index()
    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        name: "is_admin",
    })
    isAdmin: boolean;

    @OneToMany(() => Watched, watched => watched.user)
    userWatchedVideo: Watched[];

    @OneToMany(() => WatchedTvShow, watchedTvShow => watchedTvShow.user)
    userWatchedTvShow: WatchedTvShow[];

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
