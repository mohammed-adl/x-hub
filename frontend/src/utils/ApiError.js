class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    this.isOpetational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
export default ApiError;
