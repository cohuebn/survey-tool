import { StatusError } from "./status-error";

export class ForbiddenError extends StatusError {
  private static defaultMessage = "Forbidden";

  private static _statusCode = 403;

  private constructor(message: string) {
    super(message, ForbiddenError._statusCode);
  }

  static withStatusPrefix(message?: string): ForbiddenError {
    return new ForbiddenError(
      `${ForbiddenError._statusCode} ${message ?? this.defaultMessage}`,
    );
  }
}
