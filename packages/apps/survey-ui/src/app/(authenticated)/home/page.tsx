"use client";

import { CircularProgress, Typography } from "@mui/material";
import layoutStyles from "@styles/layout.module.css";
import { useMemo } from "react";
import { isNotNullOrUndefined } from "@survey-tool/core";

import { useUserSession } from "../../auth/use-user-session";
import { useUserProfile } from "../../users/use-user-profile";
import { useUserValidationData } from "../../users/use-user-validation-data";

export default function Page() {
  const { userSession, userId } = useUserSession();
  const userProfile = useUserProfile(userId);
  const { userValidation, userValidationLoaded } =
    useUserValidationData(userId);
  const hasUserBeenValidated = useMemo(
    () => isNotNullOrUndefined(userProfile?.validatedTimestamp),
    [userProfile?.validatedTimestamp],
  );

  if (!userSession.loggedIn || !userProfile || !userValidationLoaded) {
    return <CircularProgress />;
  }

  if (!hasUserBeenValidated && !userValidation) {
    return (
      <div className={layoutStyles.centeredContent}>
        <Typography variant="h2">Home</Typography>
        <Typography variant="body1">
          Before beginning, please <a href="/profile">setup your profile</a>. In
          order to ensure legitimacy of our surveys, we require validation of
          your identity before you can participate in surveys.
        </Typography>
      </div>
    );
  }

  return (
    <div className={layoutStyles.centeredContent}>
      <Typography variant="h2">Home</Typography>
      {userProfile?.validatedTimestamp ? (
        <Typography variant="body1">
          Placeholder for the homepage for approved users. Eventually, this will
          contained recently taken and potential surveys to take.
        </Typography>
      ) : (
        <Typography variant="body1">
          It looks like your profile is still pending validation. Please give us
          a little time to review your information; we&apos;ll send you an email
          once your account is validated. Once validated, you can start
          participating in surveys.
        </Typography>
      )}
    </div>
  );
}
