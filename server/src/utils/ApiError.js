/** Error with an attached HTTP status code, thrown from controllers. */
export default class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}
