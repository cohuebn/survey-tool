import { createLogger } from "@survey-tool/core";

import { getServerSideSupabaseClient } from "../../../../supabase/supbase-server-side-client";
import { getAnswersForSurvey } from "../../../../surveys/answers/database";
import { getUserIdFromAuthorizationJwt } from "../../../utils/jwts";
import { AnswersForQuestions } from "../../../../surveys/types";
import { getQuestionsForSurvey } from "../../../../surveys/questions";
import { BadRequestError } from "../../../http-errors";
import { getUserProfile } from "../../../../users/user-profiles";
import { toSavableAnswers } from "../../../../surveys/answers/to-savable-answers";
import { getParticipantId } from "../../../../surveys/participant-ids";
import { updateParticipantAnswers } from "../../../../surveys/answers/db-answer-updates";
import { convertErrorToResponse } from "../../../utils/responses";
import { toOverallRatingValue } from "../../../../surveys/answers/to-overall-rating";
import { saveOverallRating } from "../../../../surveys/overall-ratings/database";
import { SavableOverallRating } from "../../../../surveys/types/overall-ratings";
import { doesUserHaveSurveyTakingPermission } from "../../../../surveys/summaries/database";

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

    const dbClient = await getServerSideSupabaseClient();
    const userHasPermission = await doesUserHaveSurveyTakingPermission(
      dbClient(),
      userId,
      surveyId,
    );

    if (!userHasPermission) {
      return Response.json(
        { error: "User does not have permission to take this survey" },
        { status: 403 },
      );
    }

    logger.info(
      { surveyId },
      `Handling answer submission for survey ${surveyId}`,
    );

    const [userProfile, questions] = await Promise.all([
      getUserProfile(dbClient(), userId),
      getQuestionsForSurvey(dbClient(), surveyId),
    ]);

    if (!userProfile) {
      throw new Error(
        `User profile not found for user ${userId}. Cannot save answers.`,
      );
    }

    const participantId = getParticipantId(userProfile.userId, surveyId);
    const savableAnswers = toSavableAnswers(surveyId, answers, userProfile);
    const overallRatingValue = toOverallRatingValue(questions, savableAnswers);
    const overallRating: SavableOverallRating = {
      surveyId,
      participantId,
      rating: overallRatingValue,
      ratingTime: new Date(),
      location: userProfile.location,
      department: userProfile.department,
      employmentType: userProfile.employmentType,
    };

    const [, savedOverallRating] = await Promise.all([
      updateParticipantAnswers(
        dbClient(),
        participantId,
        surveyId,
        savableAnswers,
      ),
      saveOverallRating(dbClient(), overallRating),
    ]);

    return Response.json({ overallRating: savedOverallRating });
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
