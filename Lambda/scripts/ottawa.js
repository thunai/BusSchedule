module.exports = {    
  OttawaNoSlots: function (stopCode,stopName,routeID,routeName, event,callback) {
        console.log("[ 2 ]     :  OttawaNoSlots()");
        var sessionAttributes = event.session.attributes;
        var cardTitle = "Green Bus: Bus Arrival information for Bus " + routeID[0];
        var cardContent;
        var rePromptText = ""; var endSessionTF = true;
        var speechOutput;
        if (routeID.length == 0 ) { console.log("*** NULL Routes"); }
        OttawaAPIQuery(stopCode, routeID[0], function( err1, speechOutput) {
            if (err1) { console.log("Error in OttawaAPIQuery"); }            
            if (routeID.length > 1) {
                OttawaAPIQuery(stopCode,routeID[1], function(err2,data2) {
                    if (err2) { console.log("Error in OttawaAPIQuery"); }
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
  },
  OttawaWithSlots: function (stopCode,stopName,routeID,routeName, event,callback) {
        console.log("[ 2 ]     :  OttawaWithSlots()");
        if (routeID !== null ) {
            var sessionAttributes = event.session.attributes;
            var cardTitle = "Green Bus: Bus Arrival information for Bus " + routeID[0];
            var cardContent;
            var rePromptText = ""; var endSessionTF = true;
            var speechOutput;        
            OttawaAPIQuery(stopCode, routeID[0], function( err1, speechOutput) {
                if (err1) { console.log("Error in OttawaAPIQuery"); }                
                if (routeID.length > 1) {
                    OttawaAPIQuery(stopCode,routeID[1], function(err2,data2) {
                        if (err2) { console.log("Error in OttawaAPIQuery"); }
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
var OttawaAPIQuery = function (stopNo, routeNo, callback) {  
    console.log("[ 2.1 ]   :  OttawaAPIQuery() > stopNo=",stopNo," | routeNo=",routeNo);    
    var speechOutput='Unable to fetch arrival schedule now. ';    
    var http = require('http');
    var getURL = "http://api.octranspo1.com/v1.2/GetNextTripsForStop?appID=9283e2f1&apiKey=b150d06dcb622d45192d318daac92653&routeNo="+routeNo+"&stopNo="+stopNo;    
    var req = http.request(getURL, function(res) {
        var httpResponseBody = ''; 
        res.setEncoding('utf8');
        res.on('data', function(chunk) { httpResponseBody += chunk;  });
        res.on('end', function() {
            console.log(httpResponseBody);
            var xml2js = require('xml2js');
            var parser = xml2js.Parser({ explicitArray: true });
            parser.parseString(httpResponseBody, function (err, data) {
                if (err) { console.log("Error in XML Resposne from OC Transpo"); speechOutput = "Invalid Route or unable to fetch data from OC Transpo."; }
                else {
                    if (data['soap:Envelope']['soap:Body'][0]['GetNextTripsForStopResponse'][0]['GetNextTripsForStopResult'][0]['Error'][0].hasOwnProperty('_')) {
                        console.log("Error Code Object exits and value =",data['soap:Envelope']['soap:Body'][0]['GetNextTripsForStopResponse'][0]['GetNextTripsForStopResult'][0]['Error'][0]['_']);
                        speechOutput = "Unable to fetch data from OC Transpo service.";
                        return callback(null,speechOutput);                        
                    }
                    if (!data['soap:Envelope']['soap:Body'][0]['GetNextTripsForStopResponse'][0]['GetNextTripsForStopResult'][0]['Error'][0].hasOwnProperty('_')) {
                        console.log("Data found. no errors");
                        if (data['soap:Envelope']['soap:Body'][0]['GetNextTripsForStopResponse'][0]['GetNextTripsForStopResult'][0]['Route'][0]['RouteDirection'][0]['Trips'][0].hasOwnProperty('Trip')) { console.log("Trips Found");                            
                            var xmlTrips = data['soap:Envelope']['soap:Body'][0]['GetNextTripsForStopResponse'][0]['GetNextTripsForStopResult'][0]['Route'][0]['RouteDirection'][0]['Trips'][0]['Trip'];              
                            speechOutput = "Bus " + routeNo + " heading to " + xmlTrips[0]['TripDestination']  + " arrives in " + xmlTrips[0]['AdjustedScheduleTime'] + " minutes ";
                                if (xmlTrips[1].hasOwnProperty('AdjustedScheduleTime')) {
                                    speechOutput += ", and again in " + xmlTrips[1]['AdjustedScheduleTime'] + " minutes.";
                                }
                            return callback(null,speechOutput);                                                        
                        }
                        if (!data['soap:Envelope']['soap:Body'][0]['GetNextTripsForStopResponse'][0]['GetNextTripsForStopResult'][0]['Route'][0]['RouteDirection'][0]['Trips'][0].hasOwnProperty('Trip')) { console.log("Zero Trips");
                            return callback(null,"Bus " + routeNo + " is not in service now. ");
                        }
                    }
                }                     
            });
        });
        req.on('error', function(e) { console.log('problem with request: ' + e.message); });
    });
    req.end();                        
} // ---------------------------------------------------------------------------
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