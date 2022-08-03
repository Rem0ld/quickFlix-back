import {
  DeepPartial,
  DeleteResult,
  EntityManager,
  NoVersionOrUpdateDateColumnError,
} from "typeorm";
import { defaultLimit } from "../../config/defaultConfig";
import { BaseRepository, RequestBuilder, TVideo } from "../../types";
import { Video } from "./Video.entity";
import { v4 as uuidv4 } from "uuid";
import dynamicQueryBuilder from "../../utils/queryBuilder";
import { VideoDTO } from "./Video.dto";
import { DeleteExpression } from "typescript";

export default class VideoRepository implements BaseRepository<VideoDTO> {
  constructor(private manager: EntityManager) { }

  async getCount(): Promise<number> {
    return this.manager.count(Video);
  }

  async findAll(limit: number, skip: number): Promise<VideoDTO[]> {
    const result = await this.manager
      .getRepository(Video)
      .createQueryBuilder("video")
      .take(limit)
      .skip(skip)
      .getMany();

    return result.map(el => new VideoDTO(el));
  }

  async findById(id: number): Promise<VideoDTO> {
    const result = await this.manager.findOneBy(Video, {
      id,
    });
    return new VideoDTO(result);
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

  async findByFields(
    data: RequestBuilder,
    limit: number = defaultLimit,
    skip: number = 0
  ) {
    const result = await dynamicQueryBuilder(data, Video, "video")
      .take(limit)
      .skip(skip)
      .getMany();

    return result.map(el => new VideoDTO(el));
  }

  async create(videoEntity: DeepPartial<Video>) {
    const result = await this.manager.save(Video, {
      ...videoEntity,
      uuid: uuidv4(),
    });
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
}
