# Box Skill Boilerplate with Skills-Kit, Serverless, Eslint & Jest

The automated way of deploying and hosting your skills code is by putting it on a lambda cloud function with one of the commercial cloud service providers. Using a tool called serverless, we can do that in a quick and easy automated script deployment, as long as one has the user token for a cloud service provider account with permissions to create lambda cloud functions. This way one doesn't have to log into the cloud service provider's dashboard and update their code on the cloud function through manual upload and restarting of the service. 


- [When to use lambda cloud functions](#when-to-use-lambda-cloud-functions)
- [Deployment instructions](#deployment-instructions)
- [Using Eslint (formatting) and Jest (testing)](#using-eslint-formatting-and-jest-testing)


## When to use lambda cloud functions

A lambda cloud function is a short-lived server instance that only exists when it recieves an event, and shut down when it the request has been processed. This is helpful in case you skill deployment follows the following architecture, since it doesn't use any more or less of the uptime than required to process your request.

<img width="400" alt="serverless architecture" src="https://cloud.box.com/s/t3cyut4pjg46rkfxg2yva3h7t5w3qobd">

## Deployment instructions

As pre-requisites install the following locally on your developement machine:

- [Node](https://nodejs.org/en/)
- [Serverless](https://serverless.com)


Next configure your local serverless keys to point to any of the cloud hosting providers of your choice:

- AWS Lambda -> [console](https://aws.amazon.com/lambda/) | [instructions to create keys](https://serverless.com/framework/docs/providers/aws/guide/credentials/)
- IBM Open Whisk -> [console](https://www.ibm.com/cloud/functions/details) | [instructions to create keys](https://serverless.com/framework/docs/providers/openwhisk/guide/credentials/)
- Google Cloud Functions -> [console](https://cloud.google.com/functions/)| [instructions to create keys](https://serverless.com/framework/docs/providers/azure/guide/credentials/)
- Microsoft Azure -> [console](https://azure.microsoft.com/en-us/overview/serverless-computing/) | [instructions to create keys](https://serverless.com/framework/docs/providers/azure/guide/credentials/)
- Others provider options -> [Kubeless, Spotinst, Auth0, Fn, etc](https://serverless.com/framework/docs/providers/)

Deploy the hello-file-sample-skill-automated-demo code:
```
   cd  hello-file-sample-skill-automated-demo/
   npm install
   npm run deploy
```

You should see an output such as this-

```
```



## Using Eslint (formatting) and Jest (testing)


