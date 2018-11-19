// Import FilesReader and SkillsWriter classes from skills-kit-2.0.js library
const { FilesReader, SkillsWriter } = require('skills-kit-lib/skills-kit-2.0');

module.exports.handler = async (event, context, callback) => {
    // During code development you can copy an incoming box skills event
    // and paste it within integration-test-request.json file. This static request
    // would be invoked after every cloud deployment and can save you the time it takes
    // to repeatedely upload a file to box and trigger skill for testing.
    // Note: the static request event expires after some hours.
    console.debug(`Box event received: ${JSON.stringify(event)}`);

    // instantiate your two skill development helper tools
    const filesReader = new FilesReader(event.body);
    const skillsWriter = new SkillsWriter(filesReader.getFileContext());

    try {
        // One of six ways of accessing file content from Box for ML processing with FilesReader
        // ML processing code not shown here, and will need to be added by the skill developer.
        // ( see a quick sample of ML call for a skill here: https://www.diffchecker.com/GI5laFrU )
        const base64File = await filesReader.getBasicFormatContentBase64(); // eslint-disable-line no-unused-vars
        console.log(`printing simplified format file content in base64 encoding: ${base64File}`);

        const mockListOfDiscoveredKeywords = [{ text: 'file' }, { text: 'associated' }, { text: 'keywords' }];
        const mockListOfDiscoveredTranscripts = [{ text: `This is a sentence/transcript card` }];
        const mockListOfDiscoveredFaceWithPublicImageURI = [
            {
                image_url: 'https://seeklogo.com/images/B/box-logo-646A3D8C91-seeklogo.com.png',
                text: `Image hover/placeholder text if image doesn't load`
            }
        ];
        const mockListOfTranscriptsWithAppearsAtForPlaybackFiles = [
            {
                text: 'Timeline data can be shown in any card type',
                appears: [{ start: 1, end: 2 }]
            },
            {
                text: "Just add 'appears' field besides any 'text', with start and end values in seconds",
                appears: [{ start: 3, end: 4 }]
            }
        ];

        // Turn your data into correctly formatted card jsons usking SkillsWriter.
        // The cards will appear in UI in same order as they are passed in a list.
        const cards = [];
        cards.push(await skillsWriter.createFacesCard(mockListOfDiscoveredFaceWithPublicImageURI, null, 'Icons')); // changing card title to non-default 'Icons'.
        cards.push(skillsWriter.createTopicsCard(mockListOfDiscoveredKeywords));
        cards.push(skillsWriter.createTranscriptsCard(mockListOfDiscoveredTranscripts));
        cards.push(skillsWriter.createTranscriptsCard(mockListOfTranscriptsWithAppearsAtForPlaybackFiles, 5)); // for timeline total playtime seconds of file also needs to be passed.

        // Save the cards to Box in a single calls to show in UI.
        // Incase the skill is invoked on a new version upload of the same file,
        // this call will override any existing skills cards, data or error, on Box file preview.
        console.log(`cardss ${cards}`);
        await skillsWriter.saveDataCards(cards);
    } catch (error) {
        // Incase of error, write back an error card to UI.
        // Note: Skill developers may want to inspect the 'error' variable
        // and write back more specific errorCodes (@print SkillsWriter.error.keys())
        console.error(`Skill processing failed for file: ${filesReader.getFileContext().fileId} with error: ${error}`);
        await skillsWriter.saveErrorCard(skillsWriter.error.UNKNOWN);
    } finally {
        // Skills engine requires a 200 response within 10 seconds of sending an event.
        // Please see different code architecture configurations in git docs,
        // that you can apply to make sure your service always responds within time.
        callback(null, { statusCode: 200, body: 'Box event was processed by skill' });
    }
};
