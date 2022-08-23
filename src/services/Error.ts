import { Result } from "../types";

export class MissingDataPayloadException extends Error {
  constructor(missing?: string, data: any = {}) {
    super();
    this.message = `missing data in payload, ${missing.length ? missing : ""}\n
    data received: ${JSON.stringify(data)}
    `;
  }
}

export class ResourceNotExist extends Error {
  constructor(identifier: string) {
    super();
    this.message = `Resource ${identifier} does not exist`;
  }
}

export const ok = <T, E>(value: T): Result<T, E> => [value, null];
export const err = <T, E>(error: E): Result<T, E> => [null, error];
