import { asResponse, StatusError } from "../http-errors";

export function convertErrorToResponse(err: unknown): Response {
  if (err instanceof StatusError) {
    return asResponse(err);
  }
  const message = err instanceof Error ? err.message : JSON.stringify(err);
  return Response.json({ error: message }, { status: 500 });
}
