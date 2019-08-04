module.exports = class FinnError extends Error {
  constructor(httpStatusCode, message, details) {
    super(message);
    this.httpStatusCode = httpStatusCode;
    this.details = details;
  }
};
