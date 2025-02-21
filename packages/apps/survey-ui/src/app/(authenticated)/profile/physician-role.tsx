import { Box } from "@mui/material";

import { HospitalAutocomplete } from "../../hospitals/hospital-autocomplete";

export function PhysicianRole() {
  return (
    <Box>
      <HospitalAutocomplete
        initialHospital={initialHospital}
        className={styles.input}
        onChange={setLocation}
      />
      <DepartmentAutocomplete
        className={styles.input}
        initialDepartment={department}
        onChange={setDepartment}
      />
      <Autocomplete
        value={employmentType}
        onChange={(_, newValue) => setEmploymentType(newValue)}
        options={employmentTypeOptions}
        className={styles.input}
        renderInput={(params) => (
          <TextField {...params} label="Employment type" />
        )}
      />
    </Box>
  );
}
