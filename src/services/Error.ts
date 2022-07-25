import { Result } from "../types";

export default class MissingDataPayloadException extends Error {
  constructor(missing?: string) {
    super();
    this.message = `missing data in payload, ${missing.length ? missing : ""}`;
  }
}

export const ok = <T, E>(value: T): Result<T, E> => ([value, null])
export const err = <T, E>(error: E): Result<T, E> => ([null, error])