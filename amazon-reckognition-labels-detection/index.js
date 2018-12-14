//Amazon basic label image detection skills example
const { FilesReader, SkillsWriter } = require('./skills-kit-lib/skills-kit-2.0');
const AWS = require('aws-sdk');
const Axios = require('axios');

//Label parameter constants used by Rekognition to set max labels returned and minimum confidence level
const MAX_LABELS = 100;
const MIN_CONFIDENCE = 70;

//Main function called by AWS
module.exports.handler = async (event, context, callback) => {

    const filesReader = new FilesReader(event.body);
    const fileContext = filesReader.getFileContext();
    const skillsWriter = new SkillsWriter(fileContext);
    
    try {
        var response = await Axios.get(fileContext.fileDownloadURL, { responseType: 'arraybuffer' }); //Response containing image data from Box
    }
    catch(err) {
        console.log(`Error in making request to Box: ${err}`)
    }

    //Define label parameters and reference the image data we received from Box for use in the Rekognition detectLabels API call below
    const labelParams = {
        Image: {
            Bytes: new Buffer(response.data, 'binary')
        }, 
        MaxLabels: MAX_LABELS, 
        MinConfidence: MIN_CONFIDENCE
    };

    const rekognition = new AWS.Rekognition({ apiVersion: '2016-06-27' });
    rekognition.detectLabels(labelParams, (err, data) => { //Execute call to AWS Rekognition service using paremeters and image data set in labelParams
        if (err) { //There was an error processing the request
            console.log('Error on detectLabels call: ');
            console.log(err, err.stack);
        } else { //No error received, create entries array to hold the labels that are returned from Rekognition
            if (data.Labels.length > 0) {
                var entries = data.Labels.map((label) => {
                    return {
                        type: 'text',
                        text: label.Name
                    }
                });
            }

            //Create Keyword Cards
            const keywordCards = skillsWriter.createTopicsCard(entries);
            //If we have any labels that were returned from Rekognition, save them back to Box as cards
            if (keywordCards.entries.length > 0) {
                skillsWriter.saveDataCards([keywordCards], (error) => {
                    if(error) {
                        console.error(JSON.stringify(error));
                    }
                });
            }
        }
    });
    //Callback to end request
    callback(null, { statusCode: 200, body: 'Box event was processed by skill' });
}