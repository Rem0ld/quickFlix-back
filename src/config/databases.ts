import { AppDataSource } from "../data-source";

const connection = {
  async create() {
    await AppDataSource.initialize();
  },

  async close() {
    await AppDataSource.destroy();
  },

  async clear() {
    const entities = AppDataSource.entityMetadatas;
    const promises = []
    for (let entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      promises.push(repository.query(`TRUNCATE table ${entity.tableName} CASCADE;`));
    }
    await Promise.all(promises)
  },
};

export default connection;
