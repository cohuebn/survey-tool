import {
  createLogger,
  isNotNullOrUndefined,
  isNullOrUndefined,
} from "@survey-tool/core";

import { getServerSideSupabaseClient } from "../../../../supabase/supbase-server-side-client";
import { getAnswersForSurvey } from "../../../../surveys/answers/database";
import { getUserIdFromAuthorizationJwt } from "../../../utils/jwts";
import {
  Question,
  SavableAnswer,
  UserProvidedAnswersForQuestions,
} from "../../../../surveys/types";
import { getQuestionsForSurvey } from "../../../../surveys/questions";
import { toSavableAnswers } from "../../../../surveys/answers/to-savable-answers";
import { getParticipantId } from "../../../../surveys/participant-ids";
import { updateParticipantAnswers } from "../../../../surveys/answers/db-answer-updates";
import { convertErrorToResponse } from "../../../utils/responses";
import { toOverallRatingValue } from "../../../../surveys/answers/to-overall-rating";
import {
  saveOverallRating,
  deleteOverallRating,
} from "../../../../surveys/overall-ratings/database";
import { SavableOverallRating } from "../../../../surveys/types/overall-ratings";
import { doesUserHaveSurveyTakingPermission } from "../../../../surveys/summaries/database";
import { getPhysicianRolesForUser } from "../../../../users/database";
import { PhysicianRole } from "../../../../users/types";

const logger = createLogger("api/answers");

type SubmitAnswersRequest = {
  roleId: string;
  answers: UserProvidedAnswersForQuestions;
};

type PathParams = {
  surveyId: string;
};

function validateRequiredParameter(value: unknown, label: string) {
  return isNullOrUndefined(value) ? label : null;
}

function toOverallRating(
  surveyId: string,
  participantId: string,
  physicianRole: PhysicianRole,
  questions: Question[],
  answers: SavableAnswer[],
): SavableOverallRating | undefined {
  const overallRatingValue = toOverallRatingValue(questions, answers);
  return isNullOrUndefined(overallRatingValue)
    ? undefined
    : {
        surveyId,
        participantId,
        rating: overallRatingValue,
        ratingTime: new Date(),
        location: physicianRole.hospital?.id,
        department: physicianRole.department,
        employmentType: physicianRole.employmentType,
      };
}

export const revalidate = 60;

export async function POST(
  request: Request,
  { params }: { params: PathParams },
) {
  try {
    const { surveyId } = params;
    const userId = getUserIdFromAuthorizationJwt(request);
    const payload = await request.json();
    const { answers, roleId }: SubmitAnswersRequest = payload;

    const requiredParameters = [
      { value: userId, label: "userId" },
      { value: roleId, label: "roleId" },
      { value: surveyId, label: "surveyId" },
      { value: answers, label: "answers" },
    ];
    const missingParameters = requiredParameters
      .map(({ value, label }) => validateRequiredParameter(value, label))
      .filter(isNotNullOrUndefined);
    if (missingParameters.length) {
      return Response.json(
        {
          error: `Missing required parameters: ${missingParameters.join(", ")}`,
        },
        { status: 400 },
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

    const [physicianRoles, questions] = await Promise.all([
      getPhysicianRolesForUser(dbClient(), userId, roleId),
      getQuestionsForSurvey(dbClient(), surveyId),
    ]);

    if (!physicianRoles.length) {
      return Response.json(
        {
          error: `No role found with id ${roleId} for user ${userId}. Cannot save answers.`,
        },
        { status: 400 },
      );
    }
    const physicianRole = physicianRoles[0];

    const participantId = getParticipantId(userId, physicianRole.id, surveyId);
    const savableAnswers = toSavableAnswers(surveyId, answers, physicianRole);
    const overallRating = toOverallRating(
      surveyId,
      participantId,
      physicianRole,
      questions,
      savableAnswers,
    );

    const participantAnswersUpdate = updateParticipantAnswers(
      dbClient(),
      participantId,
      surveyId,
      savableAnswers,
    );
    const overallRatingUpdate = isNullOrUndefined(overallRating)
      ? deleteOverallRating(dbClient(), surveyId, participantId)
      : saveOverallRating(dbClient(), overallRating);

    const [, savedOverallRating] = await Promise.all([
      participantAnswersUpdate,
      overallRatingUpdate,
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
