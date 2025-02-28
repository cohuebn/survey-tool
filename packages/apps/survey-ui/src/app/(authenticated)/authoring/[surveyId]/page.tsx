"use client";

import { CircularProgress, Typography } from "@mui/material";
import layoutStyles from "@styles/layout.module.css";

import { SurveyEditor } from "../../../surveys";
import { useUserId } from "../../../auth/use-user-id";
import { useUserScopes } from "../../../auth/use-user-scopes";
import { adminScope, authorScope } from "../../../auth/scopes";
import { useSurveyState } from "../use-survey-state";

type PageProps = {
  params: { surveyId: string };
};

export default function Page({ params }: PageProps) {
  const { surveyId } = params;
  const userId = useUserId();
  const { surveyState: initialEditorState, surveyStateLoaded } =
    useSurveyState(surveyId);
  const { userHasScope } = useUserScopes();

  if (!userId || !surveyStateLoaded) {
    return <CircularProgress />;
  }

  if (!initialEditorState) {
    throw new Error(`Failed to get initial survey state for user ${userId}`);
  }

  if (
    userId !== initialEditorState.summary.ownerId &&
    !userHasScope(authorScope) &&
    !userHasScope(adminScope)
  ) {
    throw new Error(
      `User ${userId} does not have permission to edit survey ${surveyId}`,
    );
  }

  return (
    <div className={layoutStyles.centeredContent}>
      <Typography variant="h2">Edit this survey</Typography>
      <SurveyEditor initialEditorState={initialEditorState} />
    </div>
  );
}
