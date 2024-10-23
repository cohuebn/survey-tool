import { createLogger } from "@survey-tool/core";
import { NextRequest } from "next/server";

import { getServerSideSupabaseClient } from "../../supabase/supbase-server-side-client";
import { getHospitalsByIds } from "../../hospitals/database";

const logger = createLogger("api/locations");

export async function GET(request: NextRequest) {
  const locationIds = request.nextUrl.searchParams.getAll("locationId");
  if (locationIds.length === 0) {
    return Response.json(
      { error: "No location ids provided" },
      { status: 400 },
    );
  }
  logger.info({ locationIds }, "Fetching locations");
  const supabaseClient = await getServerSideSupabaseClient();
  const hospitals = await getHospitalsByIds(supabaseClient(), locationIds);
  return Response.json(hospitals);
}
