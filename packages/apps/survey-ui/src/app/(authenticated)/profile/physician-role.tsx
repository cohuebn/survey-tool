import {
  Autocomplete,
  Box,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Dispatch } from "react";

import { HospitalAutocomplete } from "../../hospitals/hospital-autocomplete";
import { Hospital } from "../../hospitals/types";
import { DepartmentAutocomplete } from "../../hospitals/department-autocomplete";
import { employmentTypeOptions } from "../../hospitals/employment-type-options";
import layoutStyles from "../../styles/layout.module.css";
import { PhysicianRole as PhysicianRoleModel } from "../../users/types";

import styles from "./styles.module.css";
import { PhysicianRolesAction } from "./types";

type PhysicianRoleProps = {
  roleIndex: number;
  physicianRole: PhysicianRoleModel;
  dispatch: Dispatch<PhysicianRolesAction>;
};

export function PhysicianRole({
  roleIndex,
  physicianRole,
  dispatch,
}: PhysicianRoleProps) {
  const dispatchUpdate = (value: PhysicianRoleModel) => {
    dispatch({ type: "updatePhysicianRole", index: roleIndex, value });
  };
  const updateHospital = (hospital: Hospital | null) => {
    const updatedRole: PhysicianRoleModel = {
      ...physicianRole,
      hospital: hospital ?? undefined,
    };
    dispatchUpdate(updatedRole);
  };

  const updateDepartment = (department: string | null) => {
    const updatedRole: PhysicianRoleModel = {
      ...physicianRole,
      department: department ?? undefined,
    };
    dispatchUpdate(updatedRole);
  };

  const updateEmploymentType = (employmentType: string | null) => {
    const updatedRole: PhysicianRoleModel = {
      ...physicianRole,
      employmentType: employmentType ?? undefined,
    };
    dispatchUpdate(updatedRole);
  };

  return (
    <Box className={styles.physicianRole}>
      <div className={layoutStyles.verticallyCenteredContent}>
        <div className={styles.roleLabel}>Role {roleIndex + 1}</div>
        {roleIndex > 0 ? (
          <IconButton
            onClick={() =>
              dispatch({ type: "deletePhysicianRole", index: roleIndex })
            }
          >
            <Tooltip title="Delete this role" className={styles.deleteRole}>
              <Delete />
            </Tooltip>
          </IconButton>
        ) : null}
      </div>
      <HospitalAutocomplete
        initialHospital={physicianRole.hospital}
        className={styles.input}
        onChange={(hospital) => updateHospital(hospital)}
      />
      <DepartmentAutocomplete
        className={styles.input}
        initialDepartment={physicianRole.department}
        onChange={(updatedDepartment) => updateDepartment(updatedDepartment)}
      />
      <Autocomplete
        value={physicianRole.employmentType}
        onChange={(_, newValue) => updateEmploymentType(newValue)}
        options={employmentTypeOptions}
        className={styles.input}
        renderInput={(params) => (
          <TextField {...params} label="Employment type" />
        )}
      />
    </Box>
  );
}
