# Box Skills Kit API

The Box Skills Kit is a little library that it easier for your application to interact with Box Skills. It simplifies receiving and interpreting event notifications from Box, retrieving data from Box, and writing metadata to Box.

[Overview](#overview) | [FilesReader](#FilesReader) | [SkillsWriter](#SkillsWriter) | [SkillsErrorEnum](#SkillsErrorEnum) | [FileContext](#FileContext)

## Overview

The library contains the following key exports:

* The `FilesReader` class makes it easier to interpret incoming events from Box and can retrieve files for processing
* The `SkillsWriter` class makes it easier to write data to a set of metadata templates in Box
* The `SkillsErrorEnum` enum, containing common error templates you can use to write error messages to Box using the "ErrorStatus" metadata card

## Reference

### `FilesReader`

The `FilesReader` is a helpful class to capture file information from an incoming event notification (webhook) from Box. It allows you to easily retrieve the file's content from Box.

#### Constructor

`new FilesReader(eventBody)`

Initializes a new `FilesReader` object with the body of the event received from Box.

#### Instance Functions

| Function                                 | Returns                            | Description                                                                                                                                                            |
|------------------------------------------|------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `getFileContext()`                       | [FileContext](#FileContext) object | Returns a `FileContext` object containing the attributes of the file                                                                                                   |
| `validateFormat(allowedFileFormatsList)` | Boolean                            | Checks if a given file is eligible to be processed by the skill as per the list of configured allowed formats for this skill                                           |
| `validateSize(allowedMegabytesNum)`      | Boolean                            | Checks if a given file is eligible to be processed by the skill as per the size limit                                                                                  |
| `async getContentBase64()`               | String                             | Returns a blob of the file content in Base64 encoding. Please note that Machine Learning providers generally have a size limit on passing raw file content as a string |
| `getContentStream()`                     | Stream                             | Returns a Stream that can be used to read the file directly from Box, or sent directly to a provider that suppports streams                                            |
| `async getBasicFormatFileURL()`          | String                             | Similar to using `filesReader.getFileContext().fileDownloadURL` yet returns a URL to a file in a [Basic Format](#basic-format) file                                    |
| `async getBasicFormatContentBase64()`    | String                             | Similar to using `filesReader.getContentBase64()` yet returns the file content in the [Basic Format](#basic-format)                                                    |
| `async getBasicFormatContentStream()`    | Stream                             | Similar to using `filesReader.getContentStream()` yet return a stream for the the [Basic Format](#basic-format)                                                        |

##### Basic Format 

A `BasicFormat` is an alternative, simplified representation for a file, allowing you to send more predictable and more acceptable information to your machine learning provider.

Box converts your files for you automatically into these formats:

| Original Format            | Basic Format   |
|----------------------------|----------------|
| Audio Files                | MP3            |
| Video Files                | MP4            |
| Images Files               | JPG |
| Documents and Images Files | Extracted Text |

Caution should be excercised using `BasicFormat` for large files as it involves a time delay when reading the content. Your code may experience timeouts before the converted format is fetched.

### `SkillsWriter`

The `SkillsWriter` is a helpful class used for writing metadata to Box. Writing metadata allows you to display cards within a file's metadata pane. We currently support cards for Topics, Transcripts, Timelines, Errors and Statuses.


#### Constructor

`new SkillsWriter(fileContext)`

Initializes a new `Constructor` object with the [FileContext](#FileContext) received from `filesReader.getFileContext()`. 

#### Instance Functions


| Function                                                                      | Returns                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|-------------------------------------------------------------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `createTopicsCard(topicsDataList, [fileDuration, cardTitle])`           | [DataCard](#DataCard) object | Creates a card used to show multiple keywords that are relevant to the topic of the file. `topicsDataList` is of form `[{ text: 'text1'}, { text: 'text2'} ]`. In case of an audio/video file you can also optionally show a timeline of where that words in the file, by passing down `topicsDataList` in the form `[{ text: 'text1', appears: [{ start: 0.0, end: 1.0 }]}, { text: 'text2', appears: [{ start: 1.0, end: 2.0 }]} ]` and by providing the `fileDuration` of the entire file. The default title of the card is "Topics" unless `cardTitle` is provided.                                                                                                      |
| `createTranscriptsCard(transcriptsDataList, [fileDuration, cardTitle])` | [DataCard](#DataCard) object | Creates a card used to show sentences such as speaker transcripts in audio/video, or OCR in images/documents. `transcriptDataList` is of form `[{ text: 'sentence1'}, { text: 'sentence2'} ]`. In case of an audio/video file you can also optionally show a timeline of where that sentence is spoken in the file, by passing down `transcriptsDataList` in the form `[{ text: 'sentence1', appears: [{ start: 0.0, end: 1.0 }]}, { text: 'sentence2', appears: [{ start: 1.0, end: 2.0 }]} ]` The default title of the card is "Transcript' unless `cardTitle` is provided.                                                                                                |
| `async createFacesCard(facesDataList, [fileDuration, cardTitle])`       | [DataCard](#DataCard) object | Creates a card used to show thumbnails of recognized faces or objects in the file, along with associated texts or sentences. facesDataList is of form `[{ text: 'text1', 'image_url' : thumbnailUri1}, { text: 'text2', 'image_url' : thumbnailUri2} ]`. In case of an audio/video file you can also optionally show a timeline of where that face appears in the file, by passing down `transcriptsDataList` in the form `[{ text: 'text1', appears: [{ start: 0.0, end: 1.0 }]}, { text: 'text2', appears: [{ start: 1.0, end: 2.0 }]} ]` and by providing the `fileDuration` of the entire file. The default title of the card is "Faces" unless `cardTitle` is provided. |
| `async saveDataCards(listofDataCards, [callback])`                      | `null`                       | Creates multiple metadata cards at once. Please refer to `createTopicsCard()`, `createTranscriptsCard()` and `createFacesCard()` for details. Will override any existing pending or error status cards in the UI for that file version.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `async saveProcessingCard([callback])`                                  | `null`                       | Shows a UI card with the message "We're preparing to process your file. Please hold on!". This is used for temporarily informing your users know that your skill is processing the file. An optional `callback` function can be passed that will be notified once the card has been saved.                                                                                                                                                                                                                                                                                                                                                                                   |
| `async saveErrorCard(error, [message, callback])`                       | `null`                       | Shows a UI card with the error message as noted in the [SkillsErrorEnum](#SkillsErrorEnum) table. This is used to notify a user of any kind of failure that occurs while running your Skill. An optional `message` will overwrite the the default message. An optional `callback` function can be passed that will be notified once the card has been saved.                                                                                                                                                                                                                                                                                                                 |


### `SkillsErrorEnum`

The `SkillsErrorEnum` enum contains common error templates that you can use to write error messages to Box using the `ErrorStatus` metadata card.

| Value                   | Message shown in Box UI                                                                     |
|-------------------------|---------------------------------------------------------------------------------------------|
| `FILE_PROCESSING_ERROR` | "We're sorry, something went wrong with processing the file."                               |
| `INVALID_FILE_SIZE`     | "Something went wrong with processing the file. This file size is currently not supported." |
| `INVALID_FILE_FORMAT`   | "Something went wrong with processing the file. Invalid information received."              |
| `INVALID_EVENT`         | "Something went wrong with processing the file. Invalid information received."              |
| `NO_INFO_FOUND`         | "We're sorry, no skills information was found."                                             |
| `INVOCATIONS_ERROR`     | "Something went wrong with running this skill or fetching its data."                        |
| `EXTERNAL_AUTH_ERROR`   | "Something went wrong with running this skill or fetching its data."                        |
| `BILLING_ERROR`         | "Something went wrong with running this skill or fetching its data."                        |
| `UNKNOWN`               | "Something went wrong with running this skill or fetching its data."                        |


#### Example usage

To write an error message, use the `SkillsWriter` for your file with the preferred error value.

```js
skillsWriter.saveErrorCard(SkillsErrorEnum.FILE_PROCESSING_ERROR);
```

#### `FileContext`

A set of attributes for the file to be processed.

| Attribute         | Description                              |
|-------------------|------------------------------------------|
| `fileId`          | The file ID                              |
| `fileName`        | The file name                            |
| `fileFormat`      | The file format                          |
| `fileType`        | The type of file                         |
| `fileSize`        | The file size                            |
| `fileDownloadURL` | The URL for downloading the file         |
| `fileReadToken`   | The read-ony access token for the file   |
| `fileWriteToken`  | The read/write access token for the file |
| `skillId`         | The skill ID that triggered this event   |
| `requestId`       | The ID of this event                     |