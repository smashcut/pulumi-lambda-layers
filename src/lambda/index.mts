import { execSync } from "child_process";
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log("event: ", event);
  console.log("event.body: ", event.body);

  const result = execSync("which smbclient", { stdio: "inherit" });
  console.log("result: ", result.toString());

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};
