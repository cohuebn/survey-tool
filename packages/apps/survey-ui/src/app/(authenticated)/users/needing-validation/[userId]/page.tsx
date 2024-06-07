"use client";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import layoutStyles from "@styles/layout.module.css";
import { useCallback } from "react";
import { toast } from "react-toastify";

import { useUserValidationData } from "../../../../users/use-user-validation-data";
import { useUserProfile } from "../../../../users/use-user-profile";
import { useSupabaseDb } from "../../../../supabase/use-supabase-db";
import { UserProfile } from "../../../../users/types";
import { saveUserProfile } from "../../../../users/save-user-profile";
import { convertUserToProfile } from "../../../../users/convert-user-to-profile";
import { deleteUserValidation } from "../../../../users/delete-user-validation";

import styles from "./styles.module.css";
import ValidationField from "./validation-field";

type PageProps = {
  params: { userId: string };
};

export default function Page({ params }: PageProps) {
  const { userId } = params;
  const { userValidation, userValidationLoaded } =
    useUserValidationData(userId);
  const userProfile = useUserProfile(userId);
  const dbClient = useSupabaseDb();

  const approveUser = useCallback(async () => {
    if (!dbClient.clientLoaded || !userProfile) return;
    const updatedProfile: UserProfile = {
      ...convertUserToProfile(userProfile),
      validatedTimestamp: new Date(),
    };
    await saveUserProfile(dbClient.client, updatedProfile);
    await deleteUserValidation(dbClient.client, userId);
    toast("User approved", { type: "success" });
  }, [dbClient, userId, userProfile]);

  const denyUser = useCallback(async () => {
    if (!dbClient.clientLoaded) {
      throw new Error(
        "Attempted to deny user, but the database client is not loaded",
      );
    }
    toast("User denied", { type: "success" });
  }, [dbClient]);

  if (!userValidationLoaded || !userProfile || !dbClient.clientLoaded) {
    return <CircularProgress />;
  }

  return (
    <div className={layoutStyles.centeredContent}>
      <Typography variant="h2">User validation</Typography>
      <Card className={styles.validationData}>
        <CardContent>
          <ValidationField label="Email" value={userValidation?.emailAddress} />
          <ValidationField
            label="Hospital"
            value={userProfile?.hospitals?.name}
          />
          <ValidationField label="City" value={userProfile?.hospitals?.city} />
          <ValidationField
            label="State"
            value={userProfile?.hospitals?.state}
          />
          <ValidationField label="Department" value={userProfile.department} />
          <ValidationField
            label="Employment type"
            value={userProfile.employmentType}
          />
          <ValidationField
            label="NPI number"
            value={userValidation?.npiNumber}
          />
          <ValidationField
            label="Submitted time"
            value={userValidation?.submittedTimestamp}
          />
        </CardContent>
        <CardActions>
          <Button onClick={() => approveUser()}>Approve</Button>
          <Button onClick={() => denyUser()}>Deny</Button>
        </CardActions>
      </Card>
    </div>
  );
}
