# Boilerplate Box Skill Code Using Skills-Kit, Serverless, Eslint & Jest

Use [serverless](https://serverless.com) to help in your code deployment and development

You can change it to any cloud provider:
[AWS Lambda](https://aws.amazon.com/lambda/), [Microsoft Azure](https://azure.microsoft.com/en-us/overview/serverless-computing/), [Google Cloud Functions](https://cloud.google.com/functions/) or 
[IBM Cloud Functions](https://www.ibm.com/cloud/functions/details)

pre-requisites: install npm and serverless

before you deploy your app, you should set credential with the follow cmd:
serverless config credentials --provider aws --key $CLOUD_ACC_KEY$ --secret $CLOUD_ACC_SECRET$ -o

the project can then be deployed as:

cd hello-file-sample-skill-automated-demos

npm run deploy
