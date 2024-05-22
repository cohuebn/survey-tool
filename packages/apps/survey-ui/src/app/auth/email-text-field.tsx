import { Email } from "@mui/icons-material";
import { InputAdornment, TextField, TextFieldProps } from "@mui/material";

export function EmailTextField(props: TextFieldProps) {
  return (
    <TextField
      placeholder="Email"
      fullWidth
      autoFocus
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Email />
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}
