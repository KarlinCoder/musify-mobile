export class DzArlError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

export class DeezerError extends DzArlError {}

export class MailTmError extends DzArlError {}

export class NetworkError extends DzArlError {}

export class ValidationError extends DzArlError {}
