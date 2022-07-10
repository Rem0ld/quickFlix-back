import { AppDataSource } from "../data-source";
import { logger } from "../libs/logger";

const connection = {
  async create() {
    await AppDataSource.initialize().then(() => {
      logger.info("Database is connected");
    });
  },

  async close() {
    await AppDataSource.destroy();
  },

  async clear() {
    const entities = AppDataSource.entityMetadatas;
    const promises = [];
    for (let entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      promises.push(
        repository.query(`TRUNCATE table ${entity.tableName} CASCADE;`)
      );
    }
    await Promise.all(promises);
  },
};

export default connection;
