'use strict';
exports.handler = function (event, context) {
try {    
    if (event.session.application.applicationId !== "amzn1.ask.skill.00ccdc1b-0b56-4be7-a1b0-cc45e245b46a") {
         context.fail("Invalid Application ID");
         console.log("************* [  Invalid Application ID  ] *****************");         
    } 
    if (event.session.application.applicationId === "amzn1.ask.skill.00ccdc1b-0b56-4be7-a1b0-cc45e245b46a") {
        console.log("************* [  Matching Application ID  ] *****************");
        if (event.session.new) { // 1 - NEW SESSION
            if (event.request.type === "IntentRequest")       { console.log("[  1  ]      : NEW_Intent_Request"); NEW_Intent_Request(); }
            if (event.request.type === "LaunchRequest")       { console.log("[  1  ]      : NEW_Launch_Request"); NEW_Launch_Request(); }
            if (event.request.type === "SessionEndedRequest") { context.succeed();    }
        }
    }
} catch (e) { context.fail("Exception: " + e);  }

// ============  F U N  C T I O N S   ==========================================
function NEW_Intent_Request() {    
    if (typeof event.session.user.accessToken != "undefined") {
        console.log("[ 1.1 ]     : NEW_Intent_Request > Access token FOUND and is = ", event.session.user.accessToken);
        if(!event.request.intent.slots.stop.value) { console.log("[1.1.1] : No Slots");    NEW_Intent_Request_No_Slots();   }
        if(event.request.intent.slots.stop.value)  { console.log("[1.1.1] : Slots FOUND and is =", event.request.intent.slots.stop.value); NEW_Intent_Request_With_Slots(); }        
    }
    if (typeof event.session.user.accessToken == "undefined") {
        console.log("[ 1.1 ]     : NEW_Intent_Request > No Access token");
        Anonymous_Intent_or_Launch_Request();
    }    
} // ---------------------------------------------------------------------------
function NEW_Launch_Request() {    
    if (typeof event.session.user.accessToken != "undefined") {
        console.log("[1.1]     :  NEW_Launch_Request > Access token FOUND and is = ", event.session.user.accessToken);
        NEW_Intent_Request_No_Slots();
    }
    if (typeof event.session.user.accessToken == "undefined") {
        console.log("[1.1]     :  NEW_Launch_Request > No Access token > Anonymous");
        Anonymous_Intent_or_Launch_Request();
    }
} // ---------------------------------------------------------------------------
// =============================================================================

function NEW_Intent_Request_With_Slots() {     
 DBQuery(event.session.user.accessToken, function(err,subscription,dbStopCode,dbStopName,dbRouteID,dbRouteName,dbStopCode2,dbStopName2,dbRouteID2,dbRouteName2) {    
    if (err) { Error_Dump("Error: DBQuery Response, called from NEW_Intent_Request_With_Slots", err); }
    if(event.request.intent.slots.stop.value === "first") {
        Telemetry(event, "NEW_Intent_Request_With_Slots : first", subscription);
        if ( subscription === "singapore")                  { var singaporeJS = require('./scripts/singapore');
        typeof singaporeJS.SingaporeWithSlots(          dbStopCode2, dbStopName, dbRouteID, dbRouteName, event,       function callback(sessionAttributes, speechletResponse) {
            if (!speechletResponse) { Error_Dump("Failed to get speechletResponse data from LTA"); } 
            context.succeed(buildResponse(sessionAttributes, speechletResponse));
        }); } 
        if ( subscription === "ottawa")                     { var ottawaJS = require('./scripts/ottawa');                
        typeof ottawaJS.OttawaWithSlots(                dbStopCode, dbStopName, dbRouteID, dbRouteName, event,           function callback(sessionAttributes, speechletResponse) {
            if (!speechletResponse) { Error_Dump("Failed to get speechletResponse data from OC Transpo"); } 
            context.succeed(buildResponse(sessionAttributes, speechletResponse));
        }); }             
        if ( subscription === "chicagobus")                 { var chicagobusJS = require('./scripts/chicagobus');
        typeof chicagobusJS.ChicagobusWithSlots(        dbStopCode, dbStopName, dbRouteID, dbRouteName, event,    function callback(sessionAttributes, speechletResponse) {
            if (!speechletResponse) { Error_Dump("Failed to get speechletResponse data from OC Transpo"); } 
            context.succeed(buildResponse(sessionAttributes, speechletResponse));
        }); } 
        if ( subscription === "chicagotrain")               { var chicagotrainJS = require('./scripts/chicagotrain');
        typeof chicagotrainJS.ChicagoTrainWithSlots(    dbStopCode, dbStopName, dbRouteID, dbRouteName, event, function callback(sessionAttributes, speechletResponse) {
            if (!speechletResponse) { Error_Dump("Failed to get speechletResponse data from CTA Train"); } 
            context.succeed(buildResponse(sessionAttributes, speechletResponse));
        }); }
    }
    if(event.request.intent.slots.stop.value === "second") {
        Telemetry(event, "NEW_Intent_Request_With_Slots : second", subscription);
        if ( subscription === "singapore")                  { var singaporeJS = require('./scripts/singapore');
        typeof singaporeJS.SingaporeWithSlots(          dbStopCode2, dbStopName2, dbRouteID2, dbRouteName2, event,       function callback(sessionAttributes, speechletResponse) {
            if (!speechletResponse) { Error_Dump("Failed to get speechletResponse data from LTA"); } 
            context.succeed(buildResponse(sessionAttributes, speechletResponse));
        }); } 
        if ( subscription === "ottawa")                     { var ottawaJS = require('./scripts/ottawa');                
        typeof ottawaJS.OttawaWithSlots(                dbStopCode2, dbStopName2, dbRouteID2, dbRouteName2, event,           function callback(sessionAttributes, speechletResponse) {
            if (!speechletResponse) { Error_Dump("Failed to get speechletResponse data from OC Transpo"); } 
            context.succeed(buildResponse(sessionAttributes, speechletResponse));
        }); }             
        if ( subscription === "chicagobus")                 { var chicagobusJS = require('./scripts/chicagobus');
        typeof chicagobusJS.ChicagobusWithSlots(        dbStopCode2, dbStopName2, dbRouteID2, dbRouteName2, event,    function callback(sessionAttributes, speechletResponse) {
            if (!speechletResponse) { Error_Dump("Failed to get speechletResponse data from OC Transpo"); } 
            context.succeed(buildResponse(sessionAttributes, speechletResponse));
        }); } 
        if ( subscription === "chicagotrain")               { var chicagotrainJS = require('./scripts/chicagotrain');
        typeof chicagotrainJS.ChicagoTrainWithSlots(    dbStopCode2, dbStopName2, dbRouteID2, dbRouteName2, event, function callback(sessionAttributes, speechletResponse) {
            if (!speechletResponse) { Error_Dump("Failed to get speechletResponse data from CTA Train"); } 
            context.succeed(buildResponse(sessionAttributes, speechletResponse));
        }); }
    }
    if(event.request.intent.slots.stop.value !== "first" && event.request.intent.slots.stop.value !== "second") {
        Undefined_Intent_or_Launch_Request();        
    }
  });     
} // ---------------------------------------------------------------------------
function NEW_Intent_Request_No_Slots() {
 DBQuery(event.session.user.accessToken, function(err,subscription,dbStopCode,dbStopName,dbRouteID,dbRouteName,dbStopCode2,dbStopName2,dbRouteID2,dbRouteName2) {
    if (err) {  Error_Dump("Error: DBQuery Response, called from NEW_Intent_Request_No_Slots", err); }
    Telemetry(event, "NEW_Intent_Request_No_Slots", subscription);
    if ( subscription === "singapore" )             { var singaporeJS = require('./scripts/singapore');
        typeof singaporeJS.SingaporeNoSlots(       dbStopCode, dbStopName, dbRouteID, dbRouteName, event, function callback(sessionAttributes, speechletResponse) {
            if (!speechletResponse) { Error_Dump("Failed to get speechletResponse data from LTA"); } 
            context.succeed(buildResponse(sessionAttributes, speechletResponse));
        }); } 
    if ( subscription === "ottawa" )                { var ottawaJS = require('./scripts/ottawa');                
        typeof ottawaJS.OttawaNoSlots(             dbStopCode, dbStopName, dbRouteID, dbRouteName, event, function callback(sessionAttributes, speechletResponse) {
            if (!speechletResponse) { Error_Dump("Failed to get speechletResponse data from OC Transpo"); } 
            context.succeed(buildResponse(sessionAttributes, speechletResponse));
        }); }             
    if ( subscription === "chicagobus" )            { var chicagobusJS = require('./scripts/chicagobus');
        typeof chicagobusJS.ChicagobusNoSlots(     dbStopCode, dbStopName, dbRouteID, dbRouteName, event, function callback(sessionAttributes, speechletResponse) {
            if (!speechletResponse) { Error_Dump("Failed to get speechletResponse data from OC Transpo"); } 
            context.succeed(buildResponse(sessionAttributes, speechletResponse));
        }); } 
    if ( subscription === "chicagotrain" )          { var chicagotrainJS = require('./scripts/chicagotrain');
        typeof chicagotrainJS.ChicagoTrainNoSlots( dbStopCode, dbStopName, dbRouteID, dbRouteName, event, function callback(sessionAttributes, speechletResponse) {
            if (!speechletResponse) { Error_Dump("Failed to get speechletResponse data from CTA Train"); } 
            context.succeed(buildResponse(sessionAttributes, speechletResponse));
        }); } 
    });    
} // ---------------------------------------------------------------------------
 function Anonymous_Intent_or_Launch_Request() {
    console.log("[1.1.1] : Anonymous_Intent_or_Launch_Request");
    var speechOutput = "Green Bus provides bus and train arrival information. . To use Green Bus you need to choose your default stop  and routes. . Please setup account linking using your alexa app first.";
    var sessionAttributes = event.session.attributes;
    var cardTitle = "Green Bus : Default Stop and Route is not set. Account Linking Required";
    var cardContent = "To use Green Bus you need to choose your default stop and routes. Please setup account linking using your alexa app first.";
    var rePromptText = ""; var endSessionTF = true;
    console.log(speechOutput);        
        var AWS = require('aws-sdk');
        AWS.config.region = 'us-east-1';
        var dynamodb = new AWS.DynamoDB;
        var params = { };
        var item = {
            "TimeStamp" :  event.request.timestamp,
            "SessionType": "Anonymous_Intent_or_Launch_Request",
            "AccessToken": "empty",
            "UserIDFromAlexa": event.session.user.userId,
            "Subscription": "empty"
        };        
        params.Item = item;
        params.TableName = "myCaptain_Telemetry";    
        var doc = new AWS.DynamoDB.DocumentClient();    
        doc.put(params, function(err, data) {
            if (err) { console.log("******** Error:",err); }
            console.log("[*] Telemetry Success [*]");
            context.succeed(buildResponse(sessionAttributes, buildSpeechletResponseWithLinkCard(cardTitle, cardContent, speechOutput, rePromptText, endSessionTF)));
        });    
        console.log("[] END OF Anonymous_Intent_or_Launch_Request []");
 } // --------------------------------------------------------------------------
 function Undefined_Intent_or_Launch_Request() {
    console.log("[1.1.1] : Undefined_Intent_or_Launch_Request");
    var speechOutput =  "You have not set values for this stop and route yet. . You can set two stops. . To change your selection, disable this Alexa skill and enable it again";
    var sessionAttributes = event.session.attributes;
    var cardTitle = "Green Bus: Problem with your route selection";
    var cardContent =  "You have not set values for this stop and route yet. You can set two default stops. To change your selection, disable this Alexa skill and enable it again";    
    var rePromptText = ""; var endSessionTF = true;
    console.log(speechOutput);        
        var AWS = require('aws-sdk');
        AWS.config.region = 'us-east-1';
        var dynamodb = new AWS.DynamoDB;
        var params = { };
        var item = {
            "TimeStamp" :  event.request.timestamp,
            "SessionType": "Undefined_Intent_or_Launch_Request",
            "AccessToken": event.session.user.accessToken,
            "UserIDFromAlexa": event.session.user.userId,
            "Subscription": "empty"
        };        
        params.Item = item;
        params.TableName = "myCaptain_Telemetry";    
        var doc = new AWS.DynamoDB.DocumentClient();    
        doc.put(params, function(err, data) {
            if (err) { console.log("******** Error:",err); }
            console.log("[*] Telemetry Success for Undefined_Intent_or_Launch_Request[*]");
            context.succeed(buildResponse(sessionAttributes, buildSpeechletResponseWithLinkCard(cardTitle, cardContent, speechOutput, rePromptText, endSessionTF)));
        });    
        console.log("[] END OF Undefined_Intent_or_Launch_Request []");
 } // --------------------------------------------------------------------------
 
}; // End of Context
// =============================================================================
// ------- User Defined Functions  ---------------------------------------------
function DBQuery(accessCode,callback) {    
    var AWS = require('aws-sdk'); AWS.config.region = 'us-east-1';
    var doc = new AWS.DynamoDB.DocumentClient(); var params = { };
    params.TableName = "myCaptain_UserDB";
    var key = { "AccessToken": accessCode }; params.Key = key;
    doc.get(params, function(err, data) {
        if (err) { Error_Dump("Error: DynamoDB Access Failure", JSON.stringify(err, null, 2) ); }
        else { 
        var subscription = data.Item.Subscription;
        if ( subscription === "chicagobus")   { return callback(null, subscription, data.Item.chicagobusStopCode,   data.Item.chicagobusStopName,    JSON.parse(data.Item.chicagobusRouteID),   JSON.parse(data.Item.chicagobusRouteName),   JSON.parse(data.Item.chicagobusStopCode2),   JSON.parse(data.Item.chicagobusStopName2),    JSON.parse(data.Item.chicagobusRouteID2),   JSON.parse(data.Item.chicagobusRouteName2) );    }
        if ( subscription === "ottawa")       { return callback(null, subscription, data.Item.ottawaStopCode,       data.Item.ottawaStopName,        JSON.parse(data.Item.ottawaRouteID),       JSON.parse(data.Item.ottawaRouteName),       JSON.parse(data.Item.ottawaStopCode2),       JSON.parse(data.Item.ottawaStopName2),        JSON.parse(data.Item.ottawaRouteID2),       JSON.parse(data.Item.ottawaRouteName2) );        }                
        if ( subscription === "chicagotrain") { return callback(null, subscription, data.Item.chicagotrainStopCode, data.Item.chicagotrainStopName,  JSON.parse(data.Item.chicagotrainRouteID), JSON.parse(data.Item.chicagotrainRouteName), JSON.parse(data.Item.chicagotrainStopCode2), JSON.parse(data.Item.chicagotrainStopName2),  JSON.parse(data.Item.chicagotrainRouteID2), JSON.parse(data.Item.chicagotrainRouteName2) );  }                
        if ( subscription === "singapore")    { return callback(null, subscription, data.Item.singaporeStopCode,    data.Item.singaporeStopName,     JSON.parse(data.Item.singaporeRouteID),    JSON.parse(data.Item.singaporeRouteName),    JSON.parse(data.Item.singaporeStopCode2),    JSON.parse(data.Item.singaporeStopName2),     JSON.parse(data.Item.singaporeRouteID2),    JSON.parse(data.Item.singaporeRouteName2) );     }
        }
    });
}// ----------------------------------------------------------------------------

// ------- Helper functions to build responses ---------------------------------
function buildSpeechletResponse(cardTitle, cardContent, speechOutput, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: speechOutput
        },
        card: {
            type: "Simple",
            title: cardTitle,
            content: cardContent
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
} // ---------------------------------------------------------------------------
function buildSpeechletResponseWithLinkCard(cardTitle, cardContent, speechOutput, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: speechOutput
        },
        card: {
            type: "LinkAccount",
            title: cardTitle,
            content: cardContent
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
} // ---------------------------------------------------------------------------
// -----------------------------------------------------------------------------
function buildResponse(sessionAttributes, speechletResponse) {
return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
    };
} // ---------------------------------------------------------------------------
function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
return {
    outputSpeech: {
        type: "PlainText",
        text: output
    },
    reprompt: {
        outputSpeech: {
            type: "PlainText",
            text: repromptText
        }
    },
    shouldEndSession: shouldEndSession
   };
} // ---------------------------------------------------------------------------
function Telemetry(event,sessionType,subscription) {
    console.log("[] Inside Telemetry []");
    var AWS = require('aws-sdk');
    AWS.config.region = 'us-east-1';
    var dynamodb = new AWS.DynamoDB;
    var params = { };
    var item = {
        "TimeStamp" :  event.request.timestamp,
        "SessionType": sessionType,
        "AccessToken": event.session.user.accessToken,
        "UserIDFromAlexa": event.session.user.userId,
        "Subscription": subscription
        };        
    params.Item = item;
    params.TableName = "myCaptain_Telemetry";    
    var doc = new AWS.DynamoDB.DocumentClient();    
    doc.put(params, function(err, data) {
        if (err) { console.log("******** Error:",err); }
        console.log("[*] Telemetry Success [*]");
    });    
    console.log("[] END OF Telemetry []");
 } // --------------------------------------------------------------------------
function Error_Dump(errorText, errMessage) {
 console.log(" !!!!! Error !!!!!");
 console.log("!--> ", errorText);
 console.log("!--> ", errMessage);
} // ---------------------------------------------------------------------------
// =============================================================================