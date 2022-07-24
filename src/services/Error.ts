
export default class MissingDataPayloadError extends Error {
  constructor(missing?: string) {
    super();
    this.message = `missing data in payload, ${missing.length ? missing : ""}`;
  }
}