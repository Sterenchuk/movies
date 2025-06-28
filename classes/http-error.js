export class HttpError extends Error {
  constructor(message, status = 500, code = "UNKNOWN", fields = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}
