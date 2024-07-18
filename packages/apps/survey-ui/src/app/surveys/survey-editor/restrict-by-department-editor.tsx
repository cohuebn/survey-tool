import { Dispatch } from "react";
import { Chip } from "@mui/material";

import { SurveyAllowedDepartment, SurveyEditorAction } from "../types";
import { DepartmentAutocomplete } from "../../hospitals/department-autocomplete";

import styles from "./styles.module.css";

type RestrictByDepartmentEditorProps = {
  departmentRestrictions: SurveyAllowedDepartment[];
  dispatch: Dispatch<SurveyEditorAction>;
};

export function RestrictByDepartmentEditor({
  dispatch,
  departmentRestrictions,
}: RestrictByDepartmentEditorProps) {
  const onDepartmentChange = (department: string | null) => {
    if (department) {
      dispatch({ type: "addAllowedDepartment", value: department });
    }
  };
  const onRemoveDepartment = (allowedDepartment: SurveyAllowedDepartment) => {
    dispatch({ type: "removeAllowedDepartment", value: allowedDepartment.id });
  };

  return (
    <>
      <DepartmentAutocomplete
        label="Add a department"
        onChange={onDepartmentChange}
      />
      <div className={styles.selectedChips}>
        {departmentRestrictions.map((department) => {
          return (
            <Chip
              key={department.id}
              label={department.department}
              onDelete={() => onRemoveDepartment(department)}
            />
          );
        })}
      </div>
    </>
  );
}
