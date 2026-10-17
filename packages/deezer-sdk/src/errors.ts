export class DeezerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeezerError";
    Object.setPrototypeOf(this, DeezerError.prototype);
  }
}

export class DeezerAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeezerError";
    Object.setPrototypeOf(this, DeezerError.prototype);
  }
}
