import { EntityManager } from "typeorm";
import { defaultLimit } from "../../config/defaultConfig";
import { BaseRepository, RequestBuilder, TVideo } from "../../types";
import { Video } from "./Video.entity";
import { v4 as uuidv4 } from "uuid";
import dynamicQueryBuilder from "../../utils/queryBuilder";

export default class VideoRepository implements BaseRepository<Video> {
  constructor(private manager: EntityManager) { }

  async getCount() {
    return this.manager.count(Video);
  }

  async findAll(limit: number, skip: number): Promise<Video[]> {
    return this.manager
      .getRepository(Video)
      .createQueryBuilder("video")
      .take(limit)
      .skip(skip)
      .getMany();
  }

  async findById(id: number): Promise<Video | null> {
    return this.manager.findOneBy(Video, {
      id,
    });
  }

  async findBy(
    data: { key: string; value: any },
    limit: number,
    skip: number
  ): Promise<Video[] | null> {
    return this.manager.find(Video, {
      where: {
        [data.key]: data.value,
      },
      take: limit,
      skip,
    });
  }

  async findByFields(
    data: RequestBuilder,
    limit: number = defaultLimit,
    skip: number = 0
  ) {
    return dynamicQueryBuilder(data, Video, "video")
      .take(limit)
      .skip(skip)
      .getMany();
  }

  async create(videoEntity: Omit<TVideo, "id">) {
    return this.manager.save(Video, { ...videoEntity, uuid: uuidv4() });
  }

  async createMany(data: Omit<Video, "id">[]): Promise<Video[]> {
    return this.manager.save(Video, data);
  }

  async update(id: number, data: Partial<Video>) {
    return this.manager.save(Video, { id, ...data });
  }

  async delete(id: number) {
    return this.manager
      .createQueryBuilder(Video, "video")
      .delete()
      .where("id= :id", { id: id })
      .execute();
  }

  async deleteAll() {
    return this.manager.clear(Video);
  }
}
