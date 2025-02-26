import {
  Autocomplete,
  Box,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

import { HospitalAutocomplete } from "../../hospitals/hospital-autocomplete";
import { Hospital } from "../../hospitals/types";
import { DepartmentAutocomplete } from "../../hospitals/department-autocomplete";
import { employmentTypeOptions } from "../../hospitals/employment-type-options";
import layoutStyles from "../../styles/layout.module.css";

import styles from "./styles.module.css";

type PhysicianRoleProps = {
  initialHospital: Hospital | null | undefined;
  department: string | null | undefined;
  employmentType: string | null | undefined;
  roleIndex: number;
  onHospitalChange: (hospital: Hospital | null) => void;
  onDepartmentChange: (department: string | null) => void;
  onEmploymentTypeChange: (employmentType: string | null) => void;
  onDelete: (roleIndex: number) => void;
};

export function PhysicianRole({
  initialHospital,
  department,
  employmentType,
  roleIndex,
  onHospitalChange,
  onDepartmentChange,
  onEmploymentTypeChange,
  onDelete,
}: PhysicianRoleProps) {
  return (
    <Box className={styles.physicianRole}>
      <div className={layoutStyles.verticallyCenteredContent}>
        Role {roleIndex + 1}
        {roleIndex > 0 ? (
          <IconButton onClick={() => onDelete(roleIndex)}>
            <Tooltip title="Delete this role" className={styles.deleteRole}>
              <Delete />
            </Tooltip>
          </IconButton>
        ) : null}
      </div>
      <HospitalAutocomplete
        initialHospital={initialHospital}
        className={styles.input}
        onChange={(hospital) => onHospitalChange(hospital)}
      />
      <DepartmentAutocomplete
        className={styles.input}
        initialDepartment={department}
        onChange={(updatedDepartment) => onDepartmentChange(updatedDepartment)}
      />
      <Autocomplete
        value={employmentType}
        onChange={(_, newValue) => onEmploymentTypeChange(newValue)}
        options={employmentTypeOptions}
        className={styles.input}
        renderInput={(params) => (
          <TextField {...params} label="Employment type" />
        )}
      />
    </Box>
  );
}
