// import FilesReader and SkillsWriter classes from skills-kit-2.0.js
const { FilesReader, SkillsWriter } = require('../skills-kit-2.0');

module.exports.handler = async (event, context, callback) => {
    // create new FilesReader object, and retrieve fileContext.
    const filesReader = new FilesReader(event.body);
    const fileContext = filesReader.getFileContext();

    // create new SkillsWriter object
    const skillsWriter = new SkillsWriter(fileContext);
    skillsWriter.savePendingStatusCard();

    try {
        // one of six ways of accessing file content from Box for ML processing (ML processing code not shown here).
        const mp3Base64FileString = await FilesReader.getBasicFormatContentBase64(); // eslint-disable-line no-unused-vars

        // a simple card showing multiple keywords/topics.
        const topicJSON = skillsWriter.createTopicsCard([{ text: `Hello` }, { text: `File` }]);

        // the sentence here will also appear with an associated timeline in the UI. Timelines information can be added to any type of cards.
        const transcriptJSON = skillsWriter.createTranscriptsCard([
            { text: `Hello file ${fileContext.fileId}`, appears: [{ start: 0, end: 1 }] },
            1
        ]);

        // the title of the default faces cards is being changed to 'Logos'. Card title can be changed for any type of cards.
        const logosJSON = skillsWriter.createFacesCard([
            { text: `Hello Box Logo`, image_url: 'https://seeklogo.com/images/B/box-logo-646A3D8C91-seeklogo.com.png' },
            1,
            'Logos'
        ]);

        // this will override any existing pending or error status cards in the UI, with actual topic, transcript and faces cards, for that file version.
        skillsWriter.saveDataCards([topicJSON, transcriptJSON, logosJSON]);
    } catch (error) {
        console.error(`Skill processing failed for file: ${fileContext.fileId} with error: ${error}`); // eslint-disable-line no-console

        // a developer may want to inspect the 'error' variable and write back more specific errorCodes here.
        skillsWriter.saveErrorStatusCard(skillsWriter.error.UNKNOWN);
    } finally {
        // skills engine requires a 200 response within 10 seconds of sending an event.
        callback(null, { statusCode: 200, body: 'Box event was processed by skill' });
    }
};
