import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsx from '@pulumi/awsx';

const serviceName: string = 'PersonByChance';

/**
 * CREATE THE ROLE POLICY
 *
 * this policy could be created using getPolicyDocument, will revist this option later as
 * this should be object vs string based.
 *
 * //TODO Revisit role policy creation by string, use getPolicyDocument if possible
 */
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

/**
 * CREATE THE LAMBDA LAYER WITH CHANCE AND UUID BUNDLED
 *
 * while webpack can be used to bundle dependencies into one javascript file,
 * this may increase cold start times, and size of the script.
 */
let mocksLambdaLayer: aws.lambda.LayerVersion = new aws.lambda.LayerVersion(
	'Mocks',
	{
		/**
		 * chance would not be used in production one would think, it is used
		 * for illustrative purposes only
		 */
		code: new pulumi.asset.AssetArchive({
			'nodejs/node_modules/chance': new pulumi.asset.FileArchive(
				'./node_modules/chance'
			),
			// ideally UUID would be better suited in a commons Layer
			'nodejs/node_modules/uuid': new pulumi.asset.FileArchive(
				'./node_modules/uuid'
			),
		}),
		// this layer should only be used with Node 12 or higher
		compatibleRuntimes: [aws.lambda.NodeJS12dXRuntime],
		layerName: 'mocks',
	}
);

/**
 * CREATE THE MOCK PERSON LAMBDA
 *
 * this is very similar to the AWS CDK when using a TS project and creating
 * a lone lambda prior w/o using the @aws-cdk/aws-lambda-nodejs module. The lambda
 * has to be transpiled prior to the up/deploy commmand
 */
const testLambda: aws.lambda.Function = new aws.lambda.Function(serviceName, {
	code: new pulumi.asset.AssetArchive({
		// we want the file name to be index.js as a standard across all lambdas
		'index.js': new pulumi.asset.FileAsset('./dist/random-person.lambda.js'),
	}),
	// setting this role give access to AWS Services and Resources
	role: iamForLambda.arn,
	// "index" in this case is the file name w/o extention, "handler" is the name of the function
	handler: 'index.handler',
	runtime: 'nodejs14.x',
	// we don't need alot of memory for this function as the bulk of the memory used is the change library
	memorySize: 128,
	// the results return in under 1 second, if not it should timeout
	timeout: 1,
	name: serviceName,
	layers: [mocksLambdaLayer.arn],
});
