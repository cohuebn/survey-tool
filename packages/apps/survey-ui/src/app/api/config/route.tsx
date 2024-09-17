import { getAppConfig } from "../../config";

export async function GET() {
  return Response.json(getAppConfig());
}
