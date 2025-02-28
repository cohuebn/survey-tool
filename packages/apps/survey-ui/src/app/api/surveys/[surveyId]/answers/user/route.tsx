import { NextRequest } from "next/server";

import { getUserIdFromAuthorizationJwt } from "../../../../utils/jwts";
import { getServerSideSupabaseClient } from "../../../../../supabase/supbase-server-side-client";
import { getParticipantId } from "../../../../../surveys/participant-ids";
import { getParticipantAnswersForSurvey } from "../../../../../surveys/answers/database";
import { dbAnswersToAnswers } from "../../../../../surveys/answers/answer-converters";
import { getQuestionsForSurvey } from "../../../../../surveys/questions/database";

type PathParams = {
  surveyId: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: PathParams },
) {
  const { surveyId } = params;
  const roleId = request.nextUrl.searchParams.get("roleId");
  if (!roleId) {
    return Response.json(
      { error: "Missing required parameter: roleId" },
      { status: 400 },
    );
  }
  const userId = getUserIdFromAuthorizationJwt(request);
  const participantId = getParticipantId(userId, roleId, surveyId);
  const supabaseClient = await getServerSideSupabaseClient();
  const dbQuestions = await getQuestionsForSurvey(supabaseClient(), surveyId);
  const dbAnswers = await getParticipantAnswersForSurvey(
    supabaseClient(),
    surveyId,
    participantId,
  );
  const answers = dbAnswersToAnswers(dbQuestions, dbAnswers);
  return Response.json(answers);
}
