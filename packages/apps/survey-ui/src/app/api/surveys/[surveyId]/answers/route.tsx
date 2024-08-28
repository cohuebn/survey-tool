import { createLogger } from "@survey-tool/core";

import { getSavableAnswers } from "../../../../surveys/answers/get-savable-answers";
import { Answer } from "../../../../surveys";

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
  const { surveyId } = params;
  const payload = await request.json();
  const { userId, answers }: SubmitAnswersRequest = payload;
  if (!userId || !surveyId || !answers) {
    return Response.json(
      { error: "Bad Request; expected user id, survey id, and answers" },
      { status: 400 },
    );
  }
  logger.info(
    { surveyId },
    `Handling answer submission for survey ${surveyId}`,
  );
  const savableAnswers = await getSavableAnswers(userId, surveyId, answers);
  // TODO - remove this trace
  logger.trace({ savableAnswers }, "REMOVE ME");
  return Response.json({});
}
