import { execSync } from "child_process";
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

const safeExecSync = (command: string) => {
  try {
    console.log("command: ", command);
    const result = execSync(command, { stdio: "inherit" });
    console.log("result: ", result ? result.toString() : result);
    return result.toString();
  } catch (e: any) {
    console.error("Error: ", e.toString());
    return "";
  }
};

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log("event: ", event);
  console.log("event.body: ", event.body);

  console.log("Path ", safeExecSync("echo $PATH"));
  console.log("Whereis ", safeExecSync("whereis smbclient"));
  console.log(">> ", safeExecSync("smbclient"));
  const result = safeExecSync("smbclient --version");
  console.log("result?", result.toString());

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};
