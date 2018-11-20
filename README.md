# Box Skills Kit in Node.js 


This project is the official toolkit for writing Box Custom Skills in Node.js. Your custom skill helps you extract intelligence from files residing in Box. The toolkit helps you do half the work that you would require in building a custom skill which is getting the skill event from Box, accessing your file from Box, and writing the Metadata back. However, you will still need to do the remaining half of the work of investigating a Machine Learning provider, creating an account with them, knowing how to call their API, or alternatively you could have your own intelligence logic. 


* For information on Box Skills, what kind of Preview Cards you can create, as well as a visual instructions on configuring your skills visit: [box skills developer documentation](https://developer.box.com/docs/box-skills) 

* For developer documentation on Skills-Kit library API read under [skills-kit library](skills-kit-lib) folder.
* For a quick start on deploying your first skills service use the [skills boilerplates](custom-skill-boilerplate-code) folder.
* For existing samples of Box Custom Skills visit the [box community page](www.github.com/box-community)


In general, writing your own Custom Skill could be done in a few lines of code, such as shown below for a generic ML provider:


```
const { FilesReader, SkillsWriter, SkillsErrorEnum  } = require('skills-kit-2.0');

const filesReader = FilesReader(event.body);  // This is the event recieved once you have registered your skill with Box
                                              // see deployment instructions in custom-skill-boilerplate-code/README.md
const skillsWriter = SkillsWriter(filesReader.getFileContext());

await skillsWriter.saveProcessingCard(); // let your file previewer know that your skills processing has started

// Externally processing your file through some Machine Learning (ML) Provider
const somParam = { fileUrl: filesReader.getFileContext().fileDownloadURL }; // ML API specific configurations
const data = await MLProvider.call( someParams ).catch(error){
    console.error('Error occured in ML call');
    await skillsWriter.saveErrorCard(SkillsErrorEnum.FILE_PROCESSING_ERROR);
} 

if (data.length > 0) {
   console.info(`Response recieved from ML provider ${JSON.stringify(data)}`);
   var entries = [];
   for (let i = 0; i < data.length; i++) {
       entries.push({
           type: 'text',
           text: data[i].Name
           });
       } 
   // Create metadata cards to show in Box preview next to file.
   const keywordCards = skillsWriter.createTopicsCard(entries);
   await skillsWriter.saveDataCards(keywordCards, (error) =>
       console.error(` Error occured writing back Metadata to Box ${JSON.stringify(error)});
   );
}
   
```
