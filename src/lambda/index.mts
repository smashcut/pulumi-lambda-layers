import { execSync } from "child_process";
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

const safeExecSync = (command: string) => {
  try {
    console.log("[command]:", command);
    const result = execSync(command, { stdio: "inherit" });
    console.log(result);
    console.log("[/command]");
  } catch (e: any) {
    console.error("Error: ", e);
    return "";
  }
};

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  safeExecSync("echo $PATH");
  safeExecSync("whereis smbclient");
  safeExecSync("smbclient");
  safeExecSync("smbclient --version");

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};
