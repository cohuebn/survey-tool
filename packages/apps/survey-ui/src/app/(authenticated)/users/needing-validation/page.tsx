"use client";

import {
  Autocomplete,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import layoutStyles from "@styles/layout.module.css";
import { useState } from "react";

import { useUnvalidatedUsers } from "../../../users/use-unvalidated-users";
import { useDeclinedUsers } from "../../../users/use-declined-users";

import styles from "./styles.module.css";
import { UsersNeedingValidation } from "./users-needing-validation";
import { DeniedUsers } from "./denied-users";

export default function Page() {
  const { unvalidatedUsers, unvalidatedUsersLoaded } = useUnvalidatedUsers();
  const { declinedUsers, declinedUsersLoaded } = useDeclinedUsers();
  const validatePendingOptionValue = "validatePending";
  const reviewDeclinedOptionValue = "reviewDeclined";
  const whatToDoOptions = [
    { label: "Validate pending users", value: validatePendingOptionValue },
    { label: "Review declined users", value: reviewDeclinedOptionValue },
  ];
  const [whatToDo, setWhatToDo] = useState<string>(validatePendingOptionValue);

  if (!unvalidatedUsersLoaded || !declinedUsersLoaded) {
    return <CircularProgress />;
  }

  const validatePendingUsersSection = unvalidatedUsers.length ? (
    <UsersNeedingValidation unvalidatedUsers={unvalidatedUsers} />
  ) : (
    <Typography variant="body1">
      No users currently require validation
    </Typography>
  );

  const declinedUsersSection = declinedUsers.length ? (
    <DeniedUsers deniedUsers={declinedUsers} />
  ) : (
    <Typography variant="body1">No users have been declined yet</Typography>
  );

  return (
    <div className={layoutStyles.centeredContent}>
      <Typography variant="h2">User validation</Typography>

      <Autocomplete
        className={styles.whatDoYouWantToDo}
        options={whatToDoOptions}
        renderInput={(params) => (
          <TextField {...params} label="What do you want to do?" />
        )}
        value={whatToDoOptions.find((x) => x.value === whatToDo)}
        onChange={(_, newValue) => {
          setWhatToDo(newValue?.value ?? validatePendingOptionValue);
        }}
      />
      {whatToDo === reviewDeclinedOptionValue
        ? declinedUsersSection
        : validatePendingUsersSection}
    </div>
  );
}
