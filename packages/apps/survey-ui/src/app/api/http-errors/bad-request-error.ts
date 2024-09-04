import { StatusError } from "./status-error";

export class BadRequestError extends StatusError {
  private static defaultMessage = "Bad Request";

  private static _statusCode = 400;

  private constructor(message: string) {
    super(message, BadRequestError._statusCode);
  }

  static withStatusPrefix(message?: string): BadRequestError {
    return new BadRequestError(this.formatErrorMessage(message));
  }

  static formatErrorMessage(message?: string): string {
    return `${BadRequestError._statusCode} ${message ?? this.defaultMessage}`;
  }
}
