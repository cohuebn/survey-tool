import { createLogger } from "@survey-tool/core";

import { getServerSideSupabaseClient } from "../../../../supabase/supbase-server-side-client";
import { getAnswersForSurvey } from "../../../../surveys/answers/database";
import { getUserIdFromAuthorizationJwt } from "../../../utils/jwts";
import { AnswersForQuestions } from "../../../../surveys";
import { BadRequestError } from "../../../http-errors";
import { getUserProfile } from "../../../../users/user-profiles";
import { toSavableAnswers } from "../../../../surveys/answers/to-savable-answers";
import { getParticipantId } from "../../../../surveys/participant-ids";
import { updateParticipantAnswers } from "../../../../surveys/answers/db-answer-updates";
import { convertErrorToResponse } from "../../../utils/responses";

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

    const dbClient = await getServerSideSupabaseClient();
    const userProfile = await getUserProfile(dbClient(), userId);

    if (!userProfile) {
      throw new Error(
        `User profile not found for user ${userId}. Cannot save answers.`,
      );
    }

    const dbAnswers = await toSavableAnswers(
      userId,
      surveyId,
      answers,
      userProfile,
    );
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

export async function GET(_: Request, { params }: { params: PathParams }) {
  const { surveyId } = params;
  const supabaseClient = await getServerSideSupabaseClient();
  const dbAnswers = await getAnswersForSurvey(supabaseClient(), surveyId);
  return Response.json(dbAnswers);
}
