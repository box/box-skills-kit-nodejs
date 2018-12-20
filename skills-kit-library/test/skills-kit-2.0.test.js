const { FilesReader, SkillsWriter, SkillsErrorEnum } = require('./../skills-kit-2.0');

const { Readable } = require('stream');
const jimp = require('jimp');
const urlPath = require('box-node-sdk/lib/util/url-path');

const fileId = 34426356747;
const fileName = 'sampleFileName.mp3';
const fileSize = 4200656;
const boxRequestId = '50067dc9-b656-4712-a8fa-7b3dd53848cc_1591214556';
const skillId = 75;
const readToken = 'readtoken12345';
const writeToken = 'writetoken12345';

const eventBody = {
    id: boxRequestId,
    skill: {
        id: skillId
    },
    source: {
        id: fileId,
        name: fileName,
        size: fileSize
    },
    token: {
        read: {
            access_token: readToken
        },
        write: {
            access_token: writeToken
        }
    }
};

const fileContext = {
    requestId: boxRequestId,
    skillId,
    fileId,
    fileWriteToken: writeToken
};

// Mock file stream
let mockFileStream;

describe('SkillsErrorEnum', () => {
    test('skills errors', () => {
        expect(SkillsErrorEnum.FILE_PROCESSING_ERROR).toEqual('skills_file_processing_error');
        expect(SkillsErrorEnum.INVALID_FILE_SIZE).toEqual('skills_invalid_file_size_error');
        expect(SkillsErrorEnum.INVALID_FILE_FORMAT).toEqual('skills_invalid_file_format_error');
        expect(SkillsErrorEnum.INVALID_EVENT).toEqual('skills_invalid_event_error');
        expect(SkillsErrorEnum.NO_INFO_FOUND).toEqual('skills_no_info_found');
        expect(SkillsErrorEnum.INVOCATIONS_ERROR).toEqual('skills_invocations_error');
        expect(SkillsErrorEnum.EXTERNAL_AUTH_ERROR).toEqual('skills_external_auth_error');
        expect(SkillsErrorEnum.BILLING_ERROR).toEqual('skills_billing_error');
        expect(SkillsErrorEnum.UNKNOWN).toEqual('skills_unknown_error');
    });
});

describe('FilesReader', () => {
    const body = JSON.stringify(eventBody);
    const reader = new FilesReader(body);

    beforeEach(() => {
        mockFileStream = new Readable();
        mockFileStream.push('audiofilestream');
        mockFileStream.push(null);
    });

    test('validateSize() should return true for valid file size', () => {
        expect(reader.validateSize(5)).toEqual(true);
    });

    test('validateSize() should throw exception for invalid file size', () => {
        console.error = jest.fn();
        expect(() => {
            reader.validateSize(4);
        }).toThrowError(SkillsErrorEnum.INVALID_FILE_SIZE);
        expect(console.error).toBeCalled();
    });

    test('validateFormat() should return true for valid file format', () => {
        const allowedFileFormatsList = 'flac,mp3,wav';
        expect(reader.validateFormat(allowedFileFormatsList)).toEqual(true);
    });

    test('validateFormat() should throw exception for invalid file format', () => {
        const allowedFileFormatsList = 'jpeg,jpg,png,gif,bmp,tiff';
        console.error = jest.fn();
        expect(() => {
            reader.validateFormat(allowedFileFormatsList);
        }).toThrowError(SkillsErrorEnum.INVALID_FILE_FORMAT);
        expect(console.error).toBeCalled();
    });

    test('getFileContext() should return correct context object', () => {
        const expectedContext = {
            requestId: boxRequestId,
            skillId,
            fileId,
            fileName,
            fileSize,
            fileFormat: 'mp3',
            fileType: 'AUDIO',
            fileDownloadURL: `https://api.box.com/2.0/files/${fileId}/content?access_token=${readToken}`,
            fileReadToken: readToken,
            fileWriteToken: writeToken
        };
        expect(reader.getFileContext()).toEqual(expectedContext);
    });

    test('getContentStream() should return content stream', (done) => {
        reader.fileReadClient = {
            files: {
                getReadStream: jest.fn().mockReturnValue(Promise.resolve(mockFileStream))
            }
        };

        reader.getContentStream().then((stream) => {
            expect(stream).toEqual(mockFileStream);
            expect(reader.fileReadClient.files.getReadStream).toHaveBeenCalledWith(fileId, null, expect.anything());
        });
        done();
    });

    test('getContentBase64() should return base64 encoded content', () => {
        reader.getContentStream = jest.fn().mockReturnValue(Promise.resolve(mockFileStream));

        return reader.getContentBase64().then((data) => {
            expect(data).toEqual('YXVkaW9maWxlc3RyZWFt');
            expect(reader.getContentStream).toHaveBeenCalled();
        });
    });

    test('getContentBase64() should throw exception for invalid image stream', () => {
        const invalidFileStream = 'filestream';
        reader.getContentStream = jest.fn().mockReturnValue(Promise.resolve(invalidFileStream));

        return reader.getContentBase64().catch((e) => {
            expect(e.message).toEqual('Invalid Stream, must be a readable stream.');
        });
    });

    test('getBasicFormatContentStream() should return representation content', () => {
        reader.fileReadClient = {
            files: {
                getRepresentationContent: jest.fn().mockReturnValue(Promise.resolve())
            }
        };
        return reader.getBasicFormatContentStream().then(() => {
            expect(reader.fileReadClient.files.getRepresentationContent).toHaveBeenCalledWith(fileId, '[mp3]');
        });
    });

    test('getBasicFormatContentStream() should throw exception for invalid clent', () => {
        reader.fileReadClient = {
            files: {
                getRepresentationContent: jest.fn().mockReturnValue(
                    Promise.reject({
                        statusCode: 401
                    })
                )
            }
        };

        return reader.getBasicFormatContentStream().catch((e) => {
            expect(e.message).toEqual(
                'The client provided is unauthorized. Client should have read access to the file passed'
            );
        });
    });

    test('getBasicFormatContentStream() should throw exception for non 401 error', () => {
        reader.fileReadClient = {
            files: {
                getRepresentationContent: jest.fn().mockReturnValue(Promise.reject('error'))
            }
        };

        return reader.getBasicFormatContentStream().catch((e) => {
            expect(e).toEqual('error');
        });
    });

    test('getBasicFormatContentBase64() should return base64 encoded content in basic format', () => {
        reader.getBasicFormatContentStream = jest.fn().mockReturnValue(Promise.resolve(mockFileStream));

        return reader.getBasicFormatContentBase64().then((data) => {
            expect(data).toEqual('YXVkaW9maWxlc3RyZWFt');
            expect(reader.getBasicFormatContentStream).toHaveBeenCalled();
        });
    });

    test('getBasicFormatFileURL() should throw exception if requested representation not found', () => {
        const missingReps = { entries: [] };
        console.error = jest.fn();

        reader.fileReadClient = {
            files: {
                getRepresentationInfo: jest.fn().mockReturnValue(Promise.resolve(missingReps))
            }
        };

        return reader.getBasicFormatFileURL().catch((error) => {
            expect(error.message).toEqual(SkillsErrorEnum.FILE_PROCESSING_ERROR);
            expect(console.error).toBeCalledWith('Could not get information for requested representation');
        });
    });

    test('getBasicFormatFileURL() should return url template when rep status is success', () => {
        const repInfo = {
            status: {
                state: 'success'
            },
            content: {
                url_template: 'url_template'
            }
        };
        const reps = {
            entries: [repInfo]
        };
        console.error = jest.fn();

        reader.fileReadClient = {
            files: {
                getRepresentationInfo: jest.fn().mockReturnValue(Promise.resolve(reps))
            }
        };

        return reader.getBasicFormatFileURL().then((data) => {
            expect(data).toEqual('url_template?access_token=readtoken12345');
        });
    });

    test('getBasicFormatFileURL() should return url template after polling successfully if rep status is pending', () => {
        const repInfo = {
            status: { state: 'pending' },
            content: { url_template: 'url_template' },
            info: { url: 'https://www.box.com' }
        };
        const reps = { entries: [repInfo] };
        const fileGetResponse = {
            statusCode: 200,
            body: {
                status: {
                    state: 'success'
                },
                content: {
                    url_template: 'polled_url_template'
                }
            }
        };

        reader.fileReadClient = {
            files: {
                getRepresentationInfo: jest.fn().mockReturnValue(Promise.resolve(reps))
            },
            get: jest.fn().mockReturnValue(Promise.resolve(fileGetResponse))
        };

        return reader.getBasicFormatFileURL().then((data) => {
            expect(data).toEqual('polled_url_template?access_token=readtoken12345');
        });
    });

    test('getBasicFormatFileURL() should throw exception for unknown representation status', () => {
        const repInfo = { status: { state: 'error' } };
        const reps = { entries: [repInfo] };
        console.error = jest.fn();

        reader.fileReadClient = {
            files: {
                getRepresentationInfo: jest.fn().mockReturnValue(Promise.resolve(reps))
            }
        };

        return reader.getBasicFormatFileURL().catch((error) => {
            expect(error.message).toEqual(SkillsErrorEnum.FILE_PROCESSING_ERROR);
            expect(console.error).toHaveBeenCalledWith('Representation had error status');
        });
    });
});

describe('SkillsWriter', () => {
    let writer;
    const mockDate = new Date().toISOString();
    const dt = {
        toISOString: jest.fn().mockReturnValue(mockDate)
    };
    global.Date = jest.fn(() => dt);

    beforeEach(() => {
        writer = new SkillsWriter(fileContext);
    });

    test('createMetadataCard() should return metadata card', () => {
        const status = {
            code: 'skill_invoked_status',
            message: 'invoked'
        };
        const entries = [{ text: 'test1', type: 'text' }, { text: 'test2', type: 'text' }];
        const duration = 100;
        const expectedMetadataCard = {
            created_at: mockDate,
            type: 'skill_card',
            skill: {
                type: 'service',
                id: skillId
            },
            skill_card_type: 'keyword',
            skill_card_title: {
                code: 'skills_topics',
                message: 'Topics'
            },
            invocation: {
                type: 'skill_invocation',
                id: boxRequestId
            },
            status,
            entries,
            duration
        };
        const metadataCard = writer.createMetadataCard('keyword', 'Topics', status, entries, duration);

        expect(metadataCard).toEqual(expectedMetadataCard);
    });

    test('createTopicsCard() should return topic card', () => {
        const topicDataList = [{ text: 'test1', type: 'text' }, { text: 'test2', type: 'text' }];
        const duration = 222;
        const title = 'Test Title';
        console.warn = jest.fn();


        const expectedTopicCard = {
            created_at: mockDate,
            type: 'skill_card',
            skill: {
                type: 'service',
                id: skillId
            },
            skill_card_type: 'keyword',
            skill_card_title: {
                code: 'skills_test_title',
                message: 'Test Title'
            },
            invocation: {
                type: 'skill_invocation',
                id: boxRequestId
            },
            entries: topicDataList,
            status: {},
            duration
        };

        const topicCard = writer.createTopicsCard(topicDataList, duration, title);
        expect(topicCard).toEqual(expectedTopicCard);
    });

    test('createTranscriptsCard() should return transcript card', () => {
        const transcriptsDataList = [
            { text: 'line1', appears: [{ start: 0, end: 10 }] },
            { text: 'line2', appears: [{ start: 11, end: 20 }] }
        ];
        const duration = 657;

        const expectedTranscriptCard = {
            created_at: mockDate,
            type: 'skill_card',
            skill: {
                type: 'service',
                id: skillId
            },
            skill_card_type: 'transcript',
            skill_card_title: {
                code: 'skills_transcript',
                message: 'Transcript'
            },
            invocation: {
                type: 'skill_invocation',
                id: boxRequestId
            },
            entries: transcriptsDataList,
            status: {},
            duration
        };

        const transcriptCard = writer.createTranscriptsCard(transcriptsDataList, duration);
        expect(transcriptCard).toEqual(expectedTranscriptCard);
    });

    test('createFacesCard() should return faces card', () => {
        jimp.read = jest.fn(expect.anything()).mockReturnValue(Promise.reject());
        const facesDataList = [
            {
                text: 'Unknown #1',
                appears: [{ start: 0, end: 10 }],
                image_url: 'https://box.com'
            },
            {
                text: 'Unknown #2',
                appears: [{ start: 11, end: 20 }],
                image_url: 'https://developer.box.com/'
            }
        ];

        const expectedFacesCard = {
            created_at: mockDate,
            type: 'skill_card',
            skill: {
                type: 'service',
                id: skillId
            },
            skill_card_type: 'timeline',
            skill_card_title: {
                code: 'skills_faces',
                message: 'Faces'
            },
            invocation: {
                type: 'skill_invocation',
                id: boxRequestId
            },
            entries: facesDataList,
            status: {}
        };

        return writer.createFacesCard(facesDataList).then((facesCard) => {
            expect(facesCard).toEqual(expectedFacesCard);
        });
    });

    test('saveProcessingCard() should save processing card', () => {
        const status = {
            code: 'skills_pending_status',
            message: 'We\'re preparing to process your file. Please hold on!'
        };
        const statusCard = { status: 'card' };
        const callback = () => {};

        writer.createMetadataCard = jest.fn().mockReturnValue(statusCard);
        writer.saveDataCards = jest.fn();

        writer.saveProcessingCard(callback);

        expect(writer.createMetadataCard).toHaveBeenCalledWith('status', 'Status', status);
        expect(writer.saveDataCards).toHaveBeenCalledWith([statusCard], callback, 'processing');
    });

    test('saveErrorCard() should save error card with one of the default codes from error enum', () => {
        const error = { code: SkillsErrorEnum.FILE_PROCESSING_ERROR };
        const errorCard = { error: 'card' };
        const callback = () => {};

        writer.createMetadataCard = jest.fn().mockReturnValue(errorCard);
        writer.saveDataCards = jest.fn();

        writer.saveErrorCard(SkillsErrorEnum.FILE_PROCESSING_ERROR, undefined, callback);

        expect(writer.createMetadataCard).toHaveBeenCalledWith('status', 'Error', error);
        expect(writer.saveDataCards).toHaveBeenCalledWith([errorCard], callback, 'permanent_failure');
    });

    test('saveErrorCard() should save error card with custom error message', () => {
        const customError = 'custom error message';
        const error = { code: 'custom_error', message: customError };
        const errorCard = { error: 'card' };
        const callback = () => {};

        writer.createMetadataCard = jest.fn().mockReturnValue(errorCard);
        writer.saveDataCards = jest.fn();

        writer.saveErrorCard(SkillsErrorEnum.FILE_PROCESSING_ERROR, customError, callback);

        expect(writer.createMetadataCard).toHaveBeenCalledWith('status', 'Error', error);
        expect(writer.saveDataCards).toHaveBeenCalledWith([errorCard], callback, 'permanent_failure');
    });

    test('saveDataCards() should save data cards', () => {
        const status = 'success';
        const usage = { unit: 'files', value: 1 };
        const callback = () => {};
        const dataCardsJson = JSON.stringify({ data: 'cards' });
        const body = {
            status,
            file: {
                type: 'file',
                id: writer.fileId
            },
            metadata: {
                cards: dataCardsJson
            },
            usage
        };

        const params = {
            body,
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json'
            }
        };

        const apiPath = urlPath('/skill_invocations', skillId);

        const putFunc = jest.fn();
        writer.fileWriteClient.wrapWithDefaultHandler = jest.fn().mockReturnValue(putFunc);

        writer.saveDataCards(dataCardsJson, callback);

        expect(writer.fileWriteClient.wrapWithDefaultHandler).toHaveBeenCalledWith(writer.fileWriteClient.put);
        expect(putFunc).toHaveBeenCalledWith(apiPath, params, callback);
    });
});
