import { getServerSideSupabaseClient } from "../../../../../supabase/supbase-server-side-client";
import { getAggregatedAnswersForSurvey } from "../../../../../surveys/answers/database";

type PathParams = {
  surveyId: string;
};

export async function GET(_: Request, { params }: { params: PathParams }) {
  const { surveyId } = params;
  const supabaseClient = await getServerSideSupabaseClient();
  const aggregatedAnswers = await getAggregatedAnswersForSurvey(
    supabaseClient(),
    surveyId,
  );
  return Response.json(aggregatedAnswers);
}
