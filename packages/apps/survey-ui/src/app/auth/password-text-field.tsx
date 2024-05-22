import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
  Tooltip,
} from "@mui/material";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

export function PasswordTextField(props: TextFieldProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <TextField
      type={showPassword ? "text" : "password"}
      placeholder="Password"
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Lock />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title={showPassword ? "Hide password" : "Show password"}>
              <IconButton
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
      {...props}
    ></TextField>
  );
}
