import { EntityManager, EntityRepository, Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { TVideo } from "../../types";
import { TvShow } from "../TvShow/TvShow.entity";
import { Video, VideoTypeEnum } from "./Video.entity";

class VideoRepository {
  constructor(private manager: EntityManager) {
  }

  async findAll({
    limit,
    skip,
  }: {
    limit: number;
    skip: number;
  }) {
    return this.manager
      .getRepository(Video)
      .createQueryBuilder("video")
      .take(limit)
      .skip(skip)
      .getMany();
  }

  async findOne(videoEntity: TVideo) {
    return this.manager.findOne(Video, {
      where: {
        id: videoEntity.id,
      },
    });
  }

  async findByName(videoEntity: TVideo) {
    return this.manager.find(Video, {
      where: {
        name: videoEntity.name,
      },
    });
  }

  async create(videoEntity: TVideo) {
    return this.manager.save(Video, videoEntity);
  }

  async update(videoEntity: TVideo) {
    return this.manager.update(Video, videoEntity.id, videoEntity);
  }

  async delete(videoEntity: TVideo) {
    return this.manager.remove(videoEntity);
  }
}

export default VideoRepository;
