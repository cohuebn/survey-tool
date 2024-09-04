import { StatusError } from "./status-error";

export class UnauthorizedError extends StatusError {
  private static defaultMessage = "Unauthorized";

  private static _statusCode = 401;

  private constructor(message: string) {
    super(message, UnauthorizedError._statusCode);
  }

  static withStatusPrefix(message?: string): UnauthorizedError {
    return new UnauthorizedError(
      `${UnauthorizedError._statusCode} ${message ?? this.defaultMessage}`,
    );
  }
}
