import { unparse as toCsv } from "papaparse";

import { getServerSideSupabaseClient } from "../../../../../../supabase/supbase-server-side-client";
import { getAggregatedAnswersForSurvey } from "../../../../../../surveys/answers/database";
import { getQuestionsForSurvey } from "../../../../../../surveys/questions/database";

type PathParams = {
  surveyId: string;
};

export const revalidate = 60;

export async function GET(_: Request, { params }: { params: PathParams }) {
  const { surveyId } = params;
  const supabaseClient = await getServerSideSupabaseClient();
  const [questions, aggregatedAnswers] = await Promise.all([
    getQuestionsForSurvey(supabaseClient(), surveyId),
    getAggregatedAnswersForSurvey(supabaseClient(), surveyId),
  ]);
  const questionsById = questions.reduce<
    Record<string, { id: string; question: string }>
  >(
    (_questionsById, question) => ({
      ..._questionsById,
      [question.id]: question,
    }),
    {},
  );
  const answersWithQuestionText = aggregatedAnswers.map((answer) => {
    return {
      ...answer,
      questionText: questionsById[answer.questionId].question,
    };
  });
  const csv = toCsv(answersWithQuestionText);
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=survey-${surveyId}-answers.csv`,
    },
  });
}
