import { jwtDecode, JwtPayload } from "jwt-decode";
import { getSupabaseConfigFromEnvironment } from "@survey-tool/supabase";

import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from "../http-errors";

/** Get a decoded JWT from the Authorization header of a request */
export function getAuthorizationJwt(request: Request): JwtPayload {
  const jwt = request.headers.get("Authorization");
  if (!jwt) {
    throw UnauthorizedError.withStatusPrefix(
      "Unauthorized; missing Authorization header",
    );
  }
  const decodedJwt = jwt ? jwtDecode(jwt) : null;
  if (!decodedJwt) {
    throw BadRequestError.withStatusPrefix(
      "Could not decode authorization token",
    );
  }

  const issuer = decodedJwt.iss;
  const expectedIssuer = getSupabaseConfigFromEnvironment().supabaseUrl;
  if (!issuer || !issuer.startsWith(expectedIssuer)) {
    throw ForbiddenError.withStatusPrefix(
      `Untrusted issuer for authorization token: ${issuer}`,
    );
  }
  return decodedJwt;
}

/** Get the user's id from the validated & decoded JWT */
export function getUserIdFromAuthorizationJwt(request: Request): string {
  const jwt = getAuthorizationJwt(request);
  const userId = jwt.sub;
  if (!userId) {
    throw BadRequestError.withStatusPrefix(
      "Missing user id in authorization token",
    );
  }
  return userId;
}
