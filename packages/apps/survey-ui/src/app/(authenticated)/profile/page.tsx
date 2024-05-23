"use client";

import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import buttonStyles from "@styles/buttons.module.css";
import layoutStyles from "@styles/layout.module.css";
import { useMemo, useState } from "react";

import { useUserSession } from "../../auth/use-user-session";
import { useUserProfile } from "../../users/use-user-profile";
import { useHospitalSearch } from "../../hospitals/use-hospital-search";
import { departmentOptions } from "../../hospitals/department-options";

import styles from "./styles.module.css";

export default function Page() {
  const { userSession } = useUserSession();
  const userProfile = useUserProfile();
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const matchedHospitals = useHospitalSearch(location, 500);

  const loading = useMemo(
    () => !userSession.loggedIn || !userProfile,
    [userProfile, userSession.loggedIn],
  );

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className={layoutStyles.centeredContent}>
      <Typography className={styles.header} variant="h2">
        Your profile
      </Typography>
      <Autocomplete
        className={styles.input}
        autoFocus
        autoHighlight
        options={matchedHospitals}
        filterOptions={(x) => x} // Use only the server-side filter
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.name
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        )}
        renderOption={(props, option) => {
          return (
            <li
              {...props}
              key={option.id}
              className={styles.locationAutocompleteOption}
            >
              {option.name}
              <Typography variant="caption">
                {option.city}, {option.state}
              </Typography>
            </li>
          );
        }}
      />

      <Autocomplete
        freeSolo
        className={styles.input}
        autoFocus
        autoHighlight
        options={departmentOptions}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Department"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
          />
        )}
      />

      <Autocomplete
        options={["Private practice", "Hospital"]}
        className={styles.input}
        renderInput={(params) => (
          <TextField {...params} label="Employment type" />
        )}
      />
      <Button className={buttonStyles.button} variant="contained">
        Save
      </Button>
    </div>
  );
}
