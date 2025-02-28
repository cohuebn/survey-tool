"use client";

import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  TextField,
  Typography,
} from "@mui/material";
import layoutStyles from "@styles/layout.module.css";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import clsx from "clsx";
import { isNotNullOrUndefined } from "@survey-tool/core";

import { useUserValidationData } from "../../../../users/use-user-validation-data";
import { useUserProfile } from "../../../../users/use-user-profile";
import { useSupabaseDb } from "../../../../supabase/use-supabase-db";
import { UserProfile } from "../../../../users/types";
import { saveUserProfile } from "../../../../users/user-profiles";
import {
  deleteUserValidation,
  saveUserValidation,
} from "../../../../users/user-validation";
import { usePhysicianRoles } from "../../../../users/use-physician-roles";

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
  const { physicianRoles, physicianRolesLoaded } = usePhysicianRoles(userId);
  const dbClient = useSupabaseDb();
  const userAlreadyDenied = isNotNullOrUndefined(
    userValidation?.deniedTimestamp,
  );
  const [denyModalOpen, setDenyModalOpen] = useState(false);
  const [deniedReason, setDeniedReason] = useState("");

  const approveUser = useCallback(async () => {
    if (!dbClient.clientLoaded || !userProfile) return;
    const updatedProfile: UserProfile = {
      ...userProfile,
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
    if (!userValidation) {
      throw new Error(
        `User validation data appers to be missing for ${userId} cannot deny user`,
      );
    }
    await saveUserValidation(dbClient.client, {
      ...userValidation,
      deniedTimestamp: new Date(),
      deniedReason,
    });
    toast("User denied", { type: "success" });
  }, [dbClient, userId, deniedReason, userValidation]);

  if (
    !userValidationLoaded ||
    !userProfile ||
    !physicianRolesLoaded ||
    !dbClient.clientLoaded
  ) {
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
            value={physicianRoles[0].hospital?.name}
          />
          <ValidationField
            label="City"
            value={physicianRoles[0].hospital?.city}
          />
          <ValidationField
            label="State"
            value={physicianRoles[0].hospital?.state}
          />
          <ValidationField
            label="Department"
            value={physicianRoles[0].department}
          />
          <ValidationField
            label="Employment type"
            value={physicianRoles[0].employmentType}
          />
          <ValidationField
            label="NPI number"
            value={userValidation?.npiNumber}
          />
          <ValidationField
            label="Submitted time"
            value={userValidation?.submittedTimestamp}
          />
          {userAlreadyDenied ? (
            <Alert severity="warning">
              This user has been denied for the following reason:{" "}
              {userValidation?.deniedReason}
              <br />
              If you would like to approve this user instead, just click the
              approve button below.
            </Alert>
          ) : null}
        </CardContent>
        <CardActions>
          <Button onClick={() => approveUser()}>Approve</Button>
          {userAlreadyDenied ? null : (
            <Button onClick={() => setDenyModalOpen(true)}>Deny</Button>
          )}
        </CardActions>
      </Card>
      <Dialog open={denyModalOpen} onClose={() => setDenyModalOpen(false)}>
        <div className={clsx(layoutStyles.centeredContent, styles.denyModal)}>
          Please add a reason for denying {userValidation?.emailAddress}.
          <TextField
            placeholder="Reason for denial"
            fullWidth
            multiline
            minRows={3}
            className={styles.deniedReason}
            value={deniedReason}
            onChange={(e) => setDeniedReason(e.target.value)}
          />
          <Button
            onClick={() => denyUser().then(() => setDenyModalOpen(false))}
            disabled={!deniedReason.trim()}
          >
            Confirm user denied
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
