import { EntityTarget, SelectQueryBuilder } from "typeorm";
import { AppDataSource } from "../data-source";
import { RequestBuilder } from "../types";

const builder = {
  $in: (entityName: string, el: { key: string, value: [] }) => {
    return `${entityName}.${el.key} IN (:...${el.value})`
  }
}
/**
 * for(let el in obj)
 * const result = builder[el]
 * 
 * string => like
 * number => =
 * array => in
 * 
 */
export default function dynamicQueryBuilder<T>(
  data: RequestBuilder,
  entity: EntityTarget<T>,
  entityName: string
): SelectQueryBuilder<T> {
  const builder = AppDataSource.createQueryBuilder(entity, entityName);
  for (const el in data) {
    if (!Array.isArray(data[el])) {
      builder.andWhere(`LOWER(${entityName}.${el}::text) LIKE LOWER(:${el})`, {
        [el]: `%${data[el]}%`,
      });
    } else {
      builder.andWhere(`${entityName}.${el} IN (:...${el})`, {
        [el]: data[el],
      });
    }
  }

  return builder;
}
