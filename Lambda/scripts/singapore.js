module.exports = {
    SingaporeNoSlots: function (stopCode,stopName,routeID,routeName,event,callback) {
        console.log("[ 2 ]     :  SingaporeNoSlots()");
        var sessionAttributes = event.session.attributes;
        var cardTitle = "Green Bus: Bus Arrival information for Bus " + routeID[0];
        var cardContent;
        var rePromptText = "";
        var endSessionTF = true;
        var speechOutput;        
        SingaporeAPIQuery(stopCode,routeID[0], function( err1, speechOutput) {
            if (err1) { console.log("Error while calling SingaporeAPIQuery"); }            
            if (routeID.length > 1) {               
               SingaporeAPIQuery(stopCode,routeID[1], function( err2, data2) {                   
                    if (err2) { console.log("Error while calling SingaporeAPIQuery"); }
                    speechOutput += " . . " + data2;
                    cardContent = speechOutput + " \n " + "Stop Name :  " + stopName + ".\n\n To change default stop or route, disable this Alexa skill and enable it again";
                    cardTitle += " and Bus " + routeID[1];
                    console.log("** speechOutput = " , speechOutput);
                    console.log("** cardContent = " , cardContent);                    
                    return callback(sessionAttributes, buildSpeechletResponse(cardTitle, cardContent, speechOutput, rePromptText, endSessionTF));                    
                });
            }
            if (routeID.length === 1) {
                cardContent = speechOutput + " \n " + "Stop Name :  " + stopName + ".\n\n To change default stop or route, disable this Alexa skill and enable it again";
                console.log("** speechOutput = " , speechOutput);
                console.log("** cardContent = " , cardContent);                    
                return callback(sessionAttributes, buildSpeechletResponse(cardTitle, cardContent, speechOutput, rePromptText, endSessionTF));
            }            
        });
    }, // ---------------------------------------------------------------------------------------------------------
    SingaporeWithSlots: function (stopCode,stopName,routeID,routeName, event,callback) {
        console.log("[ 2 ]     :  SingaporeWithSlots()");
        if (routeID !== null ) {
            var speechOutput = "" ;
            var sessionAttributes = event.session.attributes;
            var cardTitle = "Green Bus";
            var cardContent = "Your default bus stop is: " + stopName + ". To change default stop or route, disable this Alexa skill and enable it again";
            var rePromptText = "";        
            var endSessionTF = true;

            SingaporeAPIQuery(stopCode,routeID[0], function( err1, speechOutput) {
                if (err1) { console.log("Error while calling SingaporeAPIQuery"); }                
                if (routeID.length > 1) {               
                   SingaporeAPIQuery(stopCode,routeID[1], function( err2, data2) {                   
                        if (err2) { console.log("Error while calling SingaporeAPIQuery"); }
                        speechOutput += " . . " + data2;
                        cardContent = speechOutput + " \n " + "Stop Name :  " + stopName + ".\n\n To change default stop or route, disable this Alexa skill and enable it again";
                        cardTitle += " and Bus " + routeID[1];
                        console.log("** speechOutput = " , speechOutput);
                        console.log("** cardContent = " , cardContent);                    
                        return callback(sessionAttributes, buildSpeechletResponse(cardTitle, cardContent, speechOutput, rePromptText, endSessionTF));                    
                    });
                }
                if (routeID.length === 1) {
                    cardContent = speechOutput + " \n " + "Stop Name :  " + stopName + ".\n\n To change default stop or route, disable this Alexa skill and enable it again";
                    console.log("** speechOutput = " , speechOutput);
                    console.log("** cardContent = " , cardContent);                    
                    return callback(sessionAttributes, buildSpeechletResponse(cardTitle, cardContent, speechOutput, rePromptText, endSessionTF));
                }            
            });
        }
        if (routeID === null ) {
            var sessionAttributes = event.session.attributes;
            var cardTitle = "Green Bus: Problem with your route selection";
            var cardContent =  "You have not set this stop and route yet. To select a stop and route, disable this Alexa skill and enable it again";
            var rePromptText = ""; var endSessionTF = true;
            var speechOutput =  "You have not set this stop and route yet. To select a stop and route, disable this Alexa skill and enable it again";
            return callback(sessionAttributes, buildSpeechletResponse(cardTitle, cardContent, speechOutput, rePromptText, endSessionTF));    
        } 
    }
}; // -----------------------------------------------------------------------------
function SingaporeAPIQuery (BusStopID, ServiceNo, callback) {
console.log("[ 2.1 ]   :  SingaporeAPIQuery() > BusStopID=",BusStopID," | ServiceNo=",ServiceNo);    
var speechOutput="Unable to get information for bus " + ServiceNo + " . . Try again later.";
var currentTime=new Date();
var http = require('http');
var optionsPath = '/ltaodataservice/BusArrival?BusStopID='+BusStopID+'&ServiceNo='+ServiceNo;
var options = {
    hostname: 'datamall2.mytransport.sg',
    port: 80,
    path: optionsPath,
    method: 'GET',
    agent: false,
    headers: {
            'AccountKey': 'pbtXnB3DT92F7pv0M0mPJg==',
            'UniqueUserID': '4d30900e-fdaf-436c-850c-846d6ed26b97',
            'Accept': 'application/json'
        }
    };
var req = http.request(options, function(res) {
    var httpResponseBody = ''; 
    res.setEncoding('utf8');
    res.on('data', function(chunk) { httpResponseBody += chunk;  });
    res.on('end', function() {
        var httpResponseBodyParsed = JSON.parse(httpResponseBody); console.log(httpResponseBodyParsed);
        var currentTime=new Date();
        var nextBusTime; var subsBusTime;
       
        if ( httpResponseBodyParsed.Services.length !== 0 ) {
            if ( httpResponseBodyParsed.Services[0].Status == "Not In Operation" ) { return callback(null, "Bus " + ServiceNo + " is not in operation.");  }
            nextBusTime = Math.floor( ( ( (Date.parse(httpResponseBodyParsed.Services[0].NextBus.EstimatedArrival)       - Date.parse(currentTime) )/1000 )/60  )  );            
            if ( httpResponseBodyParsed.Services[0].SubsequentBus.EstimatedArrival !== null && typeof httpResponseBodyParsed.Services[0].SubsequentBus.EstimatedArrival !== undefined) {                                    
               subsBusTime = Math.floor( ( ( (Date.parse(httpResponseBodyParsed.Services[0].SubsequentBus.EstimatedArrival) - Date.parse(currentTime) )/1000 )/60  )  );               
            }           
            if ( nextBusTime > 0  ){ speechOutput = "Bus " + ServiceNo + " arrives in " + nextBusTime + " minutes and again in " + subsBusTime + " minutes."; }
            if ( nextBusTime <= 0 ){ speechOutput = "Bus " + ServiceNo + " is arriving now. And later in " + subsBusTime + " minutes."; }        
            return callback(null,speechOutput);
        }
        if ( httpResponseBodyParsed.Services.length == 0 ) { return callback(null, speechOutput);  }         
        req.on('error', function(e) {  console.log('problem with request: ' + e.message); });                            
        });
    });
req.end();
}
// --------------------------------------------------------------------------
var buildSpeechletResponse = function (cardTitle, cardContent, speechOutput, repromptText, shouldEndSession) {
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
}; // ---------------------------------------------------------------------------