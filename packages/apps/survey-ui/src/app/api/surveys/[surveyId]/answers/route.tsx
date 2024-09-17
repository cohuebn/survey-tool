import { createLogger } from "@survey-tool/core";

import { toSavableAnswers } from "../../../../surveys/answers/to-savable-answers";
import { Answer } from "../../../../surveys";
import { getUserIdFromAuthorizationJwt } from "../../../utils/jwts";
import { BadRequestError } from "../../../http-errors";
import { convertErrorToResponse } from "../../../utils/responses";
import { updateParticipantAnswers } from "../../../../surveys/answers/db-answer-updates";
import { getServerSideSupabaseClient } from "../../../../supabase/supbase-server-side-client";
import { getParticipantId } from "../../../../surveys/participant-ids";

const logger = createLogger("api/answers");

type SubmitAnswersRequest = {
  userId: string;
  answers: Record<string, Answer>;
};

type SubmitAnswersPathParams = {
  surveyId: string;
};

export async function POST(
  request: Request,
  { params }: { params: SubmitAnswersPathParams },
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
