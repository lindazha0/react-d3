const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");

const subscriptionKey = "bd0e4e0eaa5e4a0f8e396948efeb5a2a";
const serviceRegion = "eastus"; // e.g., "westus"
const filename = "test_food_yesterday_person_1.wav"; // 16000 Hz, Mono
const language = "en-US";

rp = require('request-promise')
reqHeader = {} // used as a request header
var querystring = require('querystring');

function createAudioConfig(filename) {
    const pushStream = sdk.AudioInputStream.createPushStream();

    fs.createReadStream(filename).on('data', arrayBuffer => {
        pushStream.write(arrayBuffer.slice());
    }).on('end', () => {
        pushStream.close();
    });

    return sdk.AudioConfig.fromStreamInput(pushStream);
}

function createRecognizer(audiofilename, audioLanguage) {
    const audioConfig = createAudioConfig(audiofilename);
    const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    speechConfig.speechRecognitionLanguage = audioLanguage;

    return new sdk.SpeechRecognizer(speechConfig, audioConfig);
}

let recognizer = createRecognizer(filename, language);

recognizer.recognizeOnceAsync(
    result => {
        console.log(result);

        recognizer.close();
        recognizer = undefined;
    },
    err => {
        console.trace("err - " + err);

        recognizer.close();
        recognizer = undefined;
    });

    recognizer.recognized = (s, e) => {
        if (e.result.reason === sdk.ResultReason.NoMatch) {
            const noMatchDetail = sdk.NoMatchDetails.fromResult(e.result);
            console.log("(recognized)  Reason: " + sdk.ResultReason[e.result.reason] + " | NoMatchReason: " + sdk.NoMatchReason[noMatchDetail.reason]);
        } else {
            console.log(`(recognized)  Reason: ${sdk.ResultReason[e.result.reason]} | Duration: ${e.result.duration} | Offset: ${e.result.offset}`);
            console.log(`Text: ${e.result.text}`);
            GetLUISContent(e.result.text);
        }
    };
    
    recognizer.canceled = (s, e) => {
        let str = "(cancel) Reason: " + sdk.CancellationReason[e.reason];
        if (e.reason === sdk.CancellationReason.Error) {
            str += ": " + e.errorDetails;
        }
        console.log(str);ß
    };
    
    recognizer.speechEndDetected = (s, e) => {
        console.log(`(speechEndDetected) SessionId: ${e.sessionId}`);
        recognizer.close();
        recognizer = undefined;
    };
    
    recognizer.startContinuousRecognitionAsync(() => {
            console.log('Recognition started');
        },
        err => {
            console.trace("err - " + err);
            recognizer.close();
            recognizer = undefined;
        });

        function GetLUISContent(utterance) {
            return console.log("{"+
                '"query": "I spent $20.00 on food yesterday.",'+
                '"prediction": {'+
                '"topIntent": "RecordExpenditure",'+
                '"projectKind": "Conversation",'+
                '"intents": ['+
                    '{'+
                        '"category": "RecordExpenditure",'+
                        '"confidenceScore": 0.85047585'+
                        '},'+
                        '{'+
                            '"category": "None",'+
                            '"confidenceScore": 0'+
                            '},'+
                            '{'+
                                '"category": "RecordIncome",'+
                                '"confidenceScore": 0'+
                                '}'+
                                '],'+
                                '"entities": ['+
                                    '{'+
                                        '"category": "TransactionAmount",'+
                                        '"text": "$20.00",'+
                                        '"offset": 8,'+
                                        '"length": 6,'+
                                        '"confidenceScore": 1,'+
                                        '"resolutions": ['+
                                            '{'+
                                                '"resolutionKind": "CurrencyResolution",'+
                                                '"unit": "Dollar",'+
                                                '"ISO4217": "",'+
                                                '"value": 20'+
                                                '}'+
                                                '],'+
                                                '"extraInformation": ['+
                                                    '{'+
                                                        '"extraInformationKind": "EntitySubtype",'+
                                                        '"value": "quantity.currency"'+
                                                        '}'+
                                                        ']'+
                                                        '},'+
                                                        '{'+
                                                            '"category": "Categories",'+
                                                            '"text": "food",'+
                                                            '"offset": 18,'+
                                                            '"length": 4,'+
                                                            '"confidenceScore": 1,'+
                                                            '"extraInformation": ['+
                                                                '{'+
                                                                    '"extraInformationKind": "ListKey",'+
                                                                    '"key": "Food"'+
                                                                    '}'+
                                                                    ']'+
                                                                    '},'+
                                                                    '{'+
                                                                        '"category": "TransactionDate",'+
                                                                        '"text": "yesterday",'+
                                                                        '"offset": 23,'+
                                                                        '"length": 9,'+
                                                                        '"confidenceScore": 1,'+
                                                                        '"resolutions": ['+
                                                                            '{'+
                                                                                '"resolutionKind": "DateTimeResolution",'+
                                                                                '"dateTimeSubKind": "Date",'+
                                                                                '"timex": "2022-10-29",'+
                                                                                '"value": "2022-10-29"'+
                                                                                '}'+
                                                                                '],'+
                                                                                '"extraInformation": ['+
                                                                                    '{'+
                                                                                        '"extraInformationKind": "EntitySubtype",'+
                                                                                        '"value": "datetime.date"'+
                                                                                        '}'+
                                                                                        ']'+
                                                                                        '}'+
                                                                                        ']'+
                                                                                        '}'+
                                                                                        '}')
        }

    // function GetLUISContent(utterance)
    // {
    //     var endpoint = "https://expensetrackerrecognition.cognitiveservices.azure.com/language/:analyze-conversations?api-version=2022-05-01";
    //     var requestId = "4ffcac1c-b2fc-48ba-bd6d-b69d9942995a";
    //     var contentType = "application/json";
    //     reqHeader={"Ocp-Apim-Subscription-Key":"6a56109b-649b-430d-b5e6-f67404f7a2df",
    // "Apim-Request-Id":requestId, "Content-Type":contentType};
    //     var searchBody = {  
    //         "kind": "Conversation",  
    //         "analysisInput": {
    //             "conversationItem" :{
    //                 "id": "1",
    //                 "text": utterance,
    //                 "modality": "text",
    //                 "participantId":"1"
    //             },
    //             "parameters":{
    //                 "projectName":"ExpenseTrackerRecognition",
    //                 "verbose":true,
    //                 "deploymentName":"TestDeployment1",
    //                 "stringIndexType":"TextElement_V8"
    //             }},       
    //             "q": utterance    
    //         }

    //     return rp.post({ uri: endpoint,
    //                   json: true,
    //                   headers: reqHeader,
    //                   body: searchBody })
    //    .then((searchResult)=>{
    //     var data = JSON.parse(searchResult);
    //         console.log(`Query: ${data.query}`);
    //         console.log(`Top Intent: ${data.topScoringIntent.intent}`);
    //         console.log('Intents:'); 
    //         console.log(data.intents); 
    //         var topIntent = data.topScoringIntent.intent;
    //         resolve(topIntent); });
    // }
    
    // "https://expensetrackerrecognition.cognitiveservices.azure.com/language/:analyze-conversations?api-version=2022-05-01"
    // -H "Ocp-Apim-Subscription-Key: "  -H "Apim-Request-Id: 4ffcac1c-b2fc-48ba-bd6d-b69d9942995a" -H "Content-Type: application/json" 
    // -d "{\"kind\":\"Conversation\",\"analysisInput\":{\"conversationItem\":{\"id\":\"PARTICIPANT_ID_HERE\",\"text\":\"YOUR_QUERY_HERE\",\"modality\":\"text\",\"language\":\"QUERY_LANGUAGE_HERE\",\"participantId\":\"PARTICIPANT_ID_HERE\"}},\"parameters\":{\"projectName\":\"ExpenseTrackerRecognition\",\"verbose\":true,\"deploymentName\":\"TestDeployment1\",\"stringIndexType\":\"TextElement_V8\"}}" 

