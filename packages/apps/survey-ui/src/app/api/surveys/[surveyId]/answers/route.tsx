import { createLogger } from "@survey-tool/core";

import { toSavableAnswers } from "../../../../surveys/answers/to-savable-answers";
import { AnswersForQuestions } from "../../../../surveys";
import { getUserIdFromAuthorizationJwt } from "../../../utils/jwts";
import { BadRequestError } from "../../../http-errors";
import { convertErrorToResponse } from "../../../utils/responses";
import { updateParticipantAnswers } from "../../../../surveys/answers/db-answer-updates";
import { getServerSideSupabaseClient } from "../../../../supabase/supbase-server-side-client";
import { getParticipantId } from "../../../../surveys/participant-ids";
import { getParticipantAnswersForSurvey } from "../../../../surveys/answers/database";
import { dbAnswersToAnswers } from "../../../../surveys/answers/answer-converters";

const logger = createLogger("api/answers");

type SubmitAnswersRequest = {
  userId: string;
  answers: AnswersForQuestions;
};

type PathParams = {
  surveyId: string;
};

export async function POST(
  request: Request,
  { params }: { params: PathParams },
) {
  try {
    const { surveyId } = params;
    const userId = getUserIdFromAuthorizationJwt(request);
    const payload = await request.json();
    const { answers }: SubmitAnswersRequest = payload;
    if (!userId || !surveyId || !answers) {
      throw BadRequestError.withStatusPrefix(
        "Expected user id, survey id, and answers",
      );
    }

    logger.info(
      { surveyId },
      `Handling answer submission for survey ${surveyId}`,
    );

    const dbAnswers = await toSavableAnswers(userId, surveyId, answers);
    const supabaseClient = await getServerSideSupabaseClient();
    const participantId = getParticipantId(userId, surveyId);
    await updateParticipantAnswers(
      supabaseClient(),
      participantId,
      surveyId,
      dbAnswers,
    );
    return Response.json({});
  } catch (err: unknown) {
    return convertErrorToResponse(err);
  }
}

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
