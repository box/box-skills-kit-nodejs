# Amazon Label Detection Skill
Use the Amazon Rekognition API to automatically extract labels from images and add them to your image files as metadata.
Amazon Rekognition provides image and video analysis. The DetectLabels endpoint that is used in this application detects instances of real-world entities that are captured in a provided image. The data that can be returned from using this skill is usually objects, events, or concepts that are present in the image provided (see screenshots folder for example return data)

## Usage
### Prerequisites
Make sure to have an AWS account Make sure to sign up for a Box Developer account and prepare your app for Box skills. See our developer documentation for more guidance. Ensure that you have given your AWS identity who will be executing the skill access to the Rekognition services

You can find these settings in the Identity Access Managment (IAM) portal in the AWS console The permissions for this user should look similar to the code below to ensure access to Rekognition has been granted. `{ "Version": "2012-10-17", "Statement": [ { "Effect": "Allow", "Action": [ "rekognition:*" ], "Resource": "*" } ] }`

### Configuring Serverless
Our Box skills uses the excellent Serverless framework. This framework allows for deployment to various serverless platforms, but in this example we will use AWS as an example.

To use Serverless, install the NPM module.

`npm install -g serverless` Next, follow our guide on configuring Serverless for AWS, or any of the guides on serverless.com to allow deploying to your favorite serverless provider.

Deploying
Clone this repo and change directory into the amazon-label-skill folder

git clone https://github.com/box-community/sample-document-skills cd amazon-label-skill

Deploy to AWS using serverless serverless deploy -v

### Frequently Asked Questions
#### Who might use this Skill?
Business processes that rely on uploading large amounts of images and sorting / classifying these images could benefit greatly from using this skill.

#### What types of files does this Skill handle?
This skill can handle .JPG, and .PNG image files

#### What metadata is written back to my Box file?
Concepts, objects, and events detected in each image file that is uploaded will be supplied as metadata on the image once the skill has finished running. For examples of specific data that is returned, please refer to the screenshots folder in this repo.

#### What implications does this have for my business?
Using Box with AWS Rekognition services can greatly reduce the time needed to classify large amounts of images. Employees time spent going through large amounts of images tagging relevant information can be greatly reduced
