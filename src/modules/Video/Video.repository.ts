import { EntityManager } from "typeorm";
import { defaultLimit } from "../../config/defaultConfig";
import { RequestBuilder, TVideo } from "../../types";
import { Video } from "./Video.entity";
import { dynamicQueryBuilder } from "./Video.service";
import { v4 as uuidv4 } from "uuid";

class VideoRepository {
  constructor(private manager: EntityManager) { }

  async getCount() {
    return this.manager.count(Video);
  }

  async findAll({
    limit,
    skip,
  }: {
    limit: number;
    skip: number;
  }): Promise<TVideo[]> {
    return this.manager
      .getRepository(Video)
      .createQueryBuilder("video")
      .take(limit)
      .skip(skip)
      .getMany();
  }

  async findById(id: number): Promise<TVideo | null> {
    return this.manager.findOneBy(Video, {
      id,
    });
  }

  async findBy(
    data: { key: string; value: any },
    limit: number,
    skip: number
  ): Promise<TVideo[] | null> {
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
    try {
      const result = await dynamicQueryBuilder(data, Video, "video")
        .take(limit)
        .skip(skip)
        .getMany();
      return result;
    } catch (error) {
      // TODO: make a class for sql errors
      throw new Error("Problem with sql request");
    }
  }

  async create(videoEntity: Omit<TVideo, "id">) {
    return this.manager.save(Video, { ...videoEntity, uuid: uuidv4() });
  }

  async update(videoEntity: TVideo) {
    return this.manager.update(Video, videoEntity.id, videoEntity);
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

export default VideoRepository;
