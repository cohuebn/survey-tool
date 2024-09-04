import { createLogger } from "@survey-tool/core";

import { getSavableAnswers } from "../../../../surveys/answers/get-savable-answers";
import { Answer } from "../../../../surveys";
import { getUserIdFromAuthorizationJwt } from "../../../utils/jwts";
import { BadRequestError } from "../../../http-errors";
import { convertErrorToResponse } from "../../../utils/responses";

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

    const savableAnswers = await getSavableAnswers(userId, surveyId, answers);
    // TODO - remove this trace
    logger.info({ savableAnswers, userId }, "REMOVE ME");
    return Response.json({});
  } catch (err: unknown) {
    return convertErrorToResponse(err);
  }
}
