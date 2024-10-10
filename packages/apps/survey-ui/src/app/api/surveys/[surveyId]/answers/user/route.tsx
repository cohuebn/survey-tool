import { getUserIdFromAuthorizationJwt } from "../../../../utils/jwts";
import { getServerSideSupabaseClient } from "../../../../../supabase/supbase-server-side-client";
import { getParticipantId } from "../../../../../surveys/participant-ids";
import { getParticipantAnswersForSurvey } from "../../../../../surveys/answers/database";
import { dbAnswersToAnswers } from "../../../../../surveys/answers/answer-converters";

type PathParams = {
  surveyId: string;
};

export async function GET(
  request: Request,
  { params }: { params: PathParams },
) {
  const { surveyId } = params;
  const userId = getUserIdFromAuthorizationJwt(request);
  const participantId = getParticipantId(userId, surveyId);
  const supabaseClient = await getServerSideSupabaseClient();
  const dbAnswers = await getParticipantAnswersForSurvey(
    supabaseClient(),
    surveyId,
    participantId,
  );
  const answers = dbAnswersToAnswers(dbAnswers);
  return Response.json(answers);
}
