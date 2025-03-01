import { getAppConfig } from "../../config";

export const revalidate = 60;

export async function GET() {
  return Response.json(getAppConfig());
}
