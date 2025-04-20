class CustomAPIError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    console.log(message);
  }
}

module.exports = CustomAPIError;
