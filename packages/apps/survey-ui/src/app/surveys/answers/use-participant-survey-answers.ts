import { useEffect, useState } from "react";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";

import { AnswersForQuestions } from "../types";
import { useSupabaseAuth } from "../../supabase/use-supabase-auth";

async function fetchSurveyAnswers(
  authClient: SupabaseAuthClient,
  surveyId: string,
): Promise<AnswersForQuestions> {
  const authSession = await authClient.getSession();
  if (authSession.error) throw authSession.error;
  const response = await fetch(`/api/surveys/${surveyId}/answers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${authSession.data.session?.access_token}`,
    },
  });
  const answers: AnswersForQuestions = await response.json();
  return answers;
}

export function useCurrentUserSurveyAnswers(surveyId: string) {
  const authClient = useSupabaseAuth();
  const [answersLoaded, setAnswersLoaded] = useState(false);
  const [answers, setAnswers] = useState<AnswersForQuestions>({});

  useEffect(() => {
    if (answersLoaded) return;
    if (!authClient.clientLoaded) return;

    fetchSurveyAnswers(authClient.auth, surveyId).then((loadedAnswers) => {
      setAnswers(loadedAnswers);
      setAnswersLoaded(true);
    });
  }, [surveyId, answersLoaded, authClient]);

  return { answers, answersLoaded };
}
