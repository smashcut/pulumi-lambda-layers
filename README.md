# Lambda w/ Lambda Layers using Pulumi

> This repository is purely for reference and is illustrative in it is purpose.


This project illustrates basic lambda deployment with lambda layers. While lambda integration with Pulumi is very simple when
integrating with other managed services, standalone lambda deployment is much like AWS CDK deployment prior to _@aws-cdk/aws-lambda-nodejs module_.


## Prerequisites

Before continuing, ensure you have met the following requirements:

* Pulumi should be installed [Pulumi Getting Started w/ AWS](https://www.pulumi.com/docs/get-started/aws/begin/)
* an AWS profile configured in **~/.aws/config** and **~/.aws/credentials**
    * there are instructions to set up an Access Key Credential Type [here](https://cdkworkshop.com/15-prerequisites/200-account.html).
* an Environment Variable set for the Pulumi Config Passphrase (any of the following methods will work using a passphrase you choose)
    * **export PULUMI_CONFIG_PASSPHRASE=\<your passphrase\>** in ~/.zshrc
    * **export PULUMI_CONFIG_PASSPHRASE_FILE=\<location to file\>** in ~/.zshrc where the file contains the passphrase
    * add one of the above environment variables inline to the beginning of the **up** and **destroy scripts**  


## Installation

* clone this repository into a directory of your choosing
* run **npm install** in that directory

## Pre-Deployment

* create a stack running the following command **pulumi stack init \<your stack name\>**
* choose the region to deploy to using the following command **pulumi config set aws:region \<your aws region\>**

## Deployment

This project does not use the standard environment in code solution seen often and opts for AWS profiles instead.

* run **npm run up -profile=\<your profile name\>** if you have defined a non default profile in the **~/.aws** files
* run **npm run up** if you have defined a default profile, or have AWS environment variables set 

## Verifying Deployment

Assuming everything runs smoothly during  deployment, it is fairly easy to verify that the solution is working. Upon 
the deployment finishing create a test for the PersonByChance lambda and use the following json as the input for the test.

 ```Javascript
{
    "id" : 12345
}
```

* The response on success should be a random person record provided by the Chance library

### Success Response Example
```Javascript
{
  "_id": "e3ab0728-b451-4cc8-85b8-9aea3a4f2e3f",
  "firstName": "Victoria",
  "lastName": "Ghini",
  "phoneNumbers": [
    "(759) 884-6945",
    "(325) 214-7348",
    "(620) 264-5700"
  ]
}
```

### Error Response when id not present
```Javascript
{
  "errorMessage": "An id must be supplied to perform a person search."
}
```

### Error Response when id is less than 0
```Javascript
{
  "errorMessage": "Ids must be greater than 0 to perform a person search."
}
```

## Destroy

This project does not use the standard environment in code solution seen often and opts for AWS profiles instead.

* run **npm run destroy -profile=\<your profile name\>** if you have defined a non default profile in the **~/.aws** files
* run **npm run destroy** if you have defined a default profile, or have AWS environment variables set 

## Notes
* This example uses npm scripts in lieu of proper a proper CICD pipeline to aid with illustration via simple commands
    * Ideally, each individual script may added as tasks in sequence in a CICD pipeline
* This repository is heavily commented to provide context as to what and why, if in VS Code feel free to collapse all comments if they are obtrusive
    * On Mac -> Press <kbd>&#8984;</kbd> + <kbd>K</kbd> then <kbd>&#8984;</kbd> + <kbd>/</kbd> 
    * On Windows & Linux -> Press <kbd>Ctrl</kbd> + <kbd>K</kbd> then <kbd>Ctrl</kbd> + <kbd>/</kbd> 
