import { createConnection, getConnection } from "typeorm";

export const connect = async () => {
  await createConnection();
};

export const close = async () => {
  await getConnection().close();
};

export const clear = () => {
  const connection = getConnection();
  const entities = connection.entityMetadatas;
  entities.forEach(async (entity) => {
    const repo = connection.getRepository(entity.name);
    await repo.query(`DELETE FROM ${entity.tableName}`);
  });
};
