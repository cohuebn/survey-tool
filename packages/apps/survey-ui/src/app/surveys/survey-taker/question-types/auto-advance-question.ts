import { Dispatch } from "react";

import { SurveyTakerAction } from "../../types/survey-taker-action";

/** Auto-advance to the next question if the user has elected auto-advance */
export function autoAdvanceIfDesired(
  autoAdvance: boolean | undefined,
  dispatch: Dispatch<SurveyTakerAction>,
) {
  if (autoAdvance) {
    setTimeout(() => {
      dispatch({ type: "moveToNextQuestion" });
    }, 750);
  }
}
