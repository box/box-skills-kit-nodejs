# Box Skill Boilerplate with Skills-Kit, Serverless, Eslint & Jest

The automated way of deploying and hosting your skills code is by putting it on a lambda cloud function with one of the commercial cloud service providers. Using a tool called serverless, we can do that in a quick and easy automated script deployment, as long as one has the user token for a cloud service provider account with permissions to create lambda cloud functions. This way one doesn't have to log into the cloud service provider's dashboard and update their code on the cloud function through manual upload and restarting of the service.

Note: if you are looking to deploy your skill on your own server, use the code available here [basic-demo-self-deploy](../hello-file-sample-skill-simple-demo)

-   [Quick Deployment instructions](#quick-deployment-instructions)
-   [How to architect lambda cloud functions](#how-to-architect-lambda-cloud-functions)
-   [Using Eslint (formatting) and Jest (testing)](#using-eslint-formatting-and-jest-testing)

## Quick deployment instructions

As pre-requisites install the following locally on your developement machine:

-   [Node](https://nodejs.org/en/)
-   [Serverless](https://serverless.com)

Next configure your local serverless keys to point to any of the cloud hosting providers of your choice:

-   AWS Lambda -> [console](https://aws.amazon.com/lambda/) | [instructions to create keys](https://serverless.com/framework/docs/providers/aws/guide/credentials/)
-   IBM Open Whisk -> [console](https://www.ibm.com/cloud/functions/details) | [instructions to create keys](https://serverless.com/framework/docs/providers/openwhisk/guide/credentials/)
-   Google Cloud Functions -> [console](https://cloud.google.com/functions/)| [instructions to create keys](https://serverless.com/framework/docs/providers/azure/guide/credentials/)
-   Microsoft Azure -> [console](https://azure.microsoft.com/en-us/overview/serverless-computing/) | [instructions to create keys](https://serverless.com/framework/docs/providers/azure/guide/credentials/)
-   Others provider options -> [Kubeless, Spotinst, Auth0, Fn, etc](https://serverless.com/framework/docs/providers/)

Deploy the hello-file-sample-skill-automated-demo code:

```
   cd  hello-file-sample-skill-automated-demo/
   npm install
   npm run deploy
```

You should see an output such as this-

```
npm run deploy

> serverless-demo-automated@1.0.0 deploy /your-project-path/box-skills-kit/custom-skill-boilerplate-code/serverless-demo-automated
> npm install;  ./node_modules/.bin/serverless deploy


> serverless-demo-automated@1.0.0 postinstall /your-project-path/box-skills-kit/custom-skill-boilerplate-code/serverless-demo-automated
> npm link ../../skills-kit-lib

up to date in 0.589s
/your-home-path/.nvm/versions/node/v9.4.0/lib/node_modules/skills-kit-lib -> /your-project-path/box-skills-kit/skills-kit-lib
/your-project-path/box-skills-kit/custom-skill-boilerplate-code/serverless-demo-automated/node_modules/skills-kit-lib -> /your-home-path/.nvm/versions/node/v9.4.0/lib/node_modules/skills-kit-lib -> /your-project-path/box-skills-kit/skills-kit-lib
removed 1 package in 4.768s
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
.....
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (13 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
..............................
Serverless: Stack update finished...
Service Information
service: my-quick-automated-demo
stage: dev
region: us-west-2
stack: my-quick-automated-demo-dev
api keys:
  None
endpoints:
  ANY - https://**********.execute-api.us-west-2.amazonaws.com/dev/my-quick-automated-demo
functions:
  skill: my-quick-automated-demo-dev-skill
```

Use this endpoint `https://**********.execute-api.us-west-2.amazonaws.com/dev/my-quick-automated-demo` to register your skill with box using this [registration form](https://goo.gl/forms/Z5K6MLKSIEJv1rih2).

## How to architect lambda cloud functions

A lambda cloud function is a short-lived server instance that only exists when it recieves an event, and shut down when it the request has been processed. This can helpful in case you skill deployment follows the following architectures, since it doesn't use any more or less of the uptime than required to process your request.

| <img width="420" alt="single server architecture" src="https://github.com/box/box-skills-kit-nodejs/blob/master/hello-file-sample-skill-automated-demo/single-server-model.png?raw=true"> | <img width="420" alt="multiple server architecture" src="https://github.com/box/box-skills-kit-nodejs/blob/master/hello-file-sample-skill-automated-demo/multiple-server-model.png?raw=true"> |

## Using Eslint (formatting) and Jest (testing)

You can improve the quality of your code by running formatting and unit-testing scripts. Simply type-

```
npm run format
```

```
npm run test
```
