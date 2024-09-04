import { StatusError } from "./status-error";

/** Convert a status error into an HTTP response */
export function asResponse(error: StatusError): Response {
  return Response.json({ error: error.message }, { status: error.statusCode });
}
