import { AppDataSource } from "../data-source";
import { logger } from "../libs/logger";

const connection = {
  async create() {
    return AppDataSource.initialize();
  },

  async close() {
    return AppDataSource.destroy();
  },

  async clear() {
    const entities = AppDataSource.entityMetadatas;
    const promises = [];
    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      promises.push(
        repository.query(`delete from "${entity.tableName}" CASCADE;`)
      );
    }
    return Promise.all(promises).catch(error => logger.error(error));
  },
};

export default connection;
