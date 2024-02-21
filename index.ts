import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const serviceName: string = "test-lambda-container";

const iamForLambda: aws.iam.Role = new aws.iam.Role(
  `iamFor${serviceName}Lambda`,
  {
    assumeRolePolicy: `{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": "sts:AssumeRole",
          "Principal": {
            "Service": "lambda.amazonaws.com"
          },
          "Effect": "Allow",
          "Sid": ""
        }
      ]
    }`,
  }
);

const basicExecution = new aws.iam.RolePolicyAttachment("basic-execution", {
  role: iamForLambda.name,
  policyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
});

const repo = new aws.ecr.Repository("repo", {
  name: "custom-lambda-container",
  forceDelete: true,
});

const image = new awsx.ecr.Image("image", {
  repositoryUrl: repo.repositoryUrl,
  dockerfile: "./Dockerfile",
  platform: "linux/amd64",
});

const testLambda: aws.lambda.Function = new aws.lambda.Function(
  serviceName,
  {
    imageUri: image.imageUri,

    packageType: "Image",
    // setting this role give access to AWS Services and Resources
    role: iamForLambda.arn,
    // "index" in this case is the file name w/o extention, "handler" is the name of the function
    // handler: "index.handler",
    // runtime: "nodejs20.x",
    // we don't need alot of memory for this function as the bulk of the memory used is the change library
    memorySize: 128,
    // the results return in under 1 second, if not it should timeout
    timeout: 10,
    name: serviceName,
  },
  { dependsOn: [iamForLambda, basicExecution] }
);

export const testLambdaArn = testLambda.arn;
