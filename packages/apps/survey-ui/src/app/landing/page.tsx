import { Grid } from "@mui/material";

import { FirstSection } from "./first-section";
import { SecondSection } from "./second-section";
import { ThirdSection } from "./third-section";

export default function Page() {
  return (
    <Grid container>
      <Grid item xs={12}>
        <FirstSection />
      </Grid>
      <Grid item xs={12}>
        <SecondSection />
      </Grid>
      <Grid item xs={12}>
        <ThirdSection />
      </Grid>
    </Grid>
  );
}
