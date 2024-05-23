import { PostgrestError } from "@supabase/supabase-js";

class PostgresError extends Error {
  cause: PostgrestError;

  constructor(cause: PostgrestError, message?: string) {
    super(message ?? cause.message);
    this.cause = cause;
  }
}

/** Convert a Supabase PostgrestError into an actual error object that can be thrown */
export function asPostgresError(underlying: PostgrestError, message?: string) {
  return new PostgresError(underlying, message);
}
