import { DeepPartial, DeleteResult, EntityManager } from "typeorm";
import { defaultLimit } from "../../config/defaultConfig";
import { BaseRepository, RequestBuilder, TResultService } from "../../types";
import { Video } from "./Video.entity";
import dynamicQueryBuilder from "../../utils/queryBuilder";
import { VideoDTO } from "./Video.dto";
import { UserDTO } from "../User/User.dto";

export default class VideoRepository implements BaseRepository<VideoDTO> {
  constructor(private manager: EntityManager) {}

  async findByUuid(uuid: string, user?: UserDTO): Promise<VideoDTO> {
    const result = await this.manager
      .createQueryBuilder(Video, "video")
      .where({ uuid })
      .leftJoinAndSelect(
        "video.userWatchedVideo",
        "watched",
        "watched.user_id = :id",
        { id: user?.id || null }
      )
      .getOne();
    return new VideoDTO(result);
  }

  async findAll(
    limit: number,
    skip: number,
    user: UserDTO | null,
    rest: Record<string, any>
  ): Promise<TResultService<VideoDTO>> {
    const result = await dynamicQueryBuilder(rest, Video, "video")
      .leftJoinAndSelect(
        "video.userWatchedVideo",
        "watched",
        "watched.user_id = :id",
        { id: user?.id || null }
      )
      .take(limit)
      .skip(skip)
      .getManyAndCount();

    return { data: result[0].map(el => new VideoDTO(el)), total: result[1] };
  }

  async findBy(
    data: { key: string; value: any },
    limit: number,
    skip: number
  ): Promise<VideoDTO[]> {
    const result = await this.manager.find(Video, {
      where: {
        [data.key]: data.value,
      },
      take: limit,
      skip,
    });

    return result.map(el => new VideoDTO(el));
  }

  async create(data: DeepPartial<Video>) {
    const result = await this.manager.save(Video, data);
    return new VideoDTO(result);
  }

  async createMany(data: DeepPartial<Video[]>) {
    const result = await this.manager.save(Video, data);
    return result.map(el => new VideoDTO(el));
  }

  async update(id: number, data: Partial<Video>) {
    const result = await this.manager.save(Video, { id, ...data });
    return new VideoDTO(result);
  }

  async delete(id: number) {
    return this.manager
      .createQueryBuilder(Video, "video")
      .delete()
      .where("id= :id", { id })
      .execute();
  }

  async deleteAll(): Promise<DeleteResult> {
    return this.manager.getRepository(Video).delete({});
  }

  async getCount(): Promise<number> {
    return this.manager.count(Video);
  }

  async findById(id: number): Promise<VideoDTO> {
    const result = await this.manager.findOneBy(Video, {
      id,
    });
    return new VideoDTO(result);
  }
}
