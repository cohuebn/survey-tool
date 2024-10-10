import { getServerSideSupabaseClient } from "../../../../../supabase/supbase-server-side-client";
import { dbAggregatedAnswersToAnswers } from "../../../../../surveys/answers/answer-converters";
import { getAggregatedAnswersForSurvey } from "../../../../../surveys/answers/database";

type PathParams = {
  surveyId: string;
};

export async function GET(_: Request, { params }: { params: PathParams }) {
  const { surveyId } = params;
  const supabaseClient = await getServerSideSupabaseClient();
  const dbAggregatedAnswers = await getAggregatedAnswersForSurvey(
    supabaseClient(),
    surveyId,
  );
  const aggregatedAnswers = dbAggregatedAnswersToAnswers(dbAggregatedAnswers);
  return Response.json(aggregatedAnswers);
}
