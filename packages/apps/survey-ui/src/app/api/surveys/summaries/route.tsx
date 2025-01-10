import { NextRequest } from "next/server";

import { getUserScopes } from "../../../auth/database";
import { authorScope } from "../../../auth/scopes";
import { getServerSideSupabaseClient } from "../../../supabase/supbase-server-side-client";
import {
  getSurveySummaries,
  getUserRestrictedSurveySummaries,
} from "../../../surveys/summaries/database";
import { getUserIdFromAuthorizationJwt } from "../../utils/jwts";
import { ServerSideSupabaseClient } from "../../../supabase/types";

function queryStringToBoolean(value: string | null): boolean {
  return value?.toLowerCase() === "true";
}

async function getSurveySummariesForRequest(
  supabaseClient: ServerSideSupabaseClient,
  restrictUsingUserPermissions: boolean,
  userId: string,
) {
  return restrictUsingUserPermissions
    ? getUserRestrictedSurveySummaries(supabaseClient(), userId)
    : getSurveySummaries(supabaseClient(), {});
}

export async function GET(request: NextRequest) {
  const userId = getUserIdFromAuthorizationJwt(request);
  const authoring = queryStringToBoolean(
    request.nextUrl.searchParams.get("authoring"),
  );
  const reviewing = queryStringToBoolean(
    request.nextUrl.searchParams.get("reviewing"),
  );
  const supabaseClient = await getServerSideSupabaseClient();
  if (authoring) {
    const userScopes = await getUserScopes(supabaseClient(), userId);
    if (!userScopes.includes(authorScope)) {
      return Response.json(
        { error: "User does not have authoring permission" },
        { status: 403 },
      );
    }
  }
  const restrictByUserPermissions = !authoring && !reviewing;
  const surveySummaries = await getSurveySummariesForRequest(
    supabaseClient,
    restrictByUserPermissions,
    userId,
  );
  return Response.json(surveySummaries);
}
