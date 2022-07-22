import { EntityTarget, SelectQueryBuilder } from "typeorm";
import { AppDataSource } from "../data-source";
import { RequestBuilder } from "../types";

export default function dynamicQueryBuilder<T>(
  data: RequestBuilder,
  entity: EntityTarget<T>,
  entityName: string
): SelectQueryBuilder<T> {
  const builder = AppDataSource.createQueryBuilder(entity, entityName);
  for (const el in data) {
    if (!Array.isArray(data[el])) {
      builder.andWhere(`${entityName}.${el}::text LIKE :${el}`, {
        [el]: `${data[el]}%`,
      });
    } else {
      builder.andWhere(`${entityName}.${el} IN (:...${el})`, {
        [el]: data[el],
      });
    }
  }

  return builder;
}