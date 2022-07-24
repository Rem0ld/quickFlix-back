
export default class MissingDataPayloadException extends Error {
  constructor(missing?: string) {
    super();
    this.message = `missing data in payload, ${missing.length ? missing : ""}`;
  }
}