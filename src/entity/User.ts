import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    Timestamp,
} from "typeorm";
import { Watched } from "./Watched";
import { WatchedTvShow } from "./WatchedTvShow";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
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

    @UpdateDateColumn(({ name: "updated_at" }))
    updatedAt: Date
}
