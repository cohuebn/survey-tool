import { getServerSideSupabaseClient } from "../../../../supabase/supbase-server-side-client";
import { doesUserHaveSurveyTakingPermission } from "../../../../surveys/summaries/database";
import { getUserIdFromAuthorizationJwt } from "../../../utils/jwts";

type PathParams = {
  surveyId: string;
};

export const revalidate = 60;

export async function GET(
  request: Request,
  { params }: { params: PathParams },
) {
  const userId = getUserIdFromAuthorizationJwt(request);
  const { surveyId } = params;
  const supabaseClient = await getServerSideSupabaseClient();
  const userHasPermission = await doesUserHaveSurveyTakingPermission(
    supabaseClient(),
    userId,
    surveyId,
  );
  return Response.json({ userHasPermission });
}
