import { createLogger } from "@survey-tool/core";

import { getServerSideSupabaseClient } from "../../../../supabase/supbase-server-side-client";
import { getParticipatingHospitals } from "../../../../surveys/answers/database";

const logger = createLogger("api/surveys/[surveyId]/participating-hospitals");

type PathParams = {
  surveyId: string;
};

export const revalidate = 60;

export async function GET(_: Request, { params }: { params: PathParams }) {
  const { surveyId } = params;
  logger.info({ surveyId }, "Fetching participating hospitals for survey");
  const supabaseClient = await getServerSideSupabaseClient();
  const dbAnswers = await getParticipatingHospitals(supabaseClient(), surveyId);
  return Response.json(dbAnswers);
}
