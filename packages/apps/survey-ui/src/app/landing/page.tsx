import { Grid } from "@mui/material";

import { FirstSection } from "./first-section";
import { SecondSection } from "./second-section";
import { ThirdSection } from "./third-section";
import { FourthSection } from "./fourth-section";
import { FifthSection } from "./fifth-section";
import { SixthSection } from "./sixth-section";

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
      <Grid item xs={12}>
        <FourthSection />
      </Grid>
      <Grid item xs={12}>
        <FifthSection />
      </Grid>
      <Grid item xs={12}>
        <SixthSection />
      </Grid>
    </Grid>
  );
}
