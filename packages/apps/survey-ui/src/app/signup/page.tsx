import {
  Button,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import Link from "next/link";

import buttonStyles from "../styles/buttons.module.css";
import authStyles from "../styles/auth.module.css";

export default function Page() {
  return (
    <div className={authStyles.container}>
      <div className={authStyles.backgroundFooter}></div>
      <Card className={authStyles.primarySection} elevation={3}>
        <CardContent>
          <Typography className={authStyles.header} variant="h2">
            Sign up
          </Typography>
          <Typography className={authStyles.subheader} variant="h3">
            We're glad you're here!
          </Typography>

          <form className={authStyles.form}>
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
            ></TextField>
            <TextField
              type="password"
              placeholder="Password"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            ></TextField>
            <div className={buttonStyles.buttons}>
              <Button className={buttonStyles.button} variant="contained">
                Login
              </Button>
            </div>
          </form>
          <p className={authStyles.alternateActionLink}>
            Already have an account? <Link href="/login">Login here.</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
