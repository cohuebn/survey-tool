import { Autocomplete, TextField } from "@mui/material";

import { departmentOptions } from "./department-options";

type DepartmentAutocompleteProps = {
  className?: string;
  label?: string;
  initialDepartment?: string | null;
  onChange?: (department: string | null) => void;
};

export function DepartmentAutocomplete({
  className,
  label,
  initialDepartment,
  onChange,
}: DepartmentAutocompleteProps) {
  return (
    <Autocomplete
      freeSolo
      className={className}
      autoFocus
      autoHighlight
      options={departmentOptions}
      value={initialDepartment}
      onChange={(_, newValue) => onChange?.(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label ?? "Department"}
          value={initialDepartment}
        />
      )}
    />
  );
}
