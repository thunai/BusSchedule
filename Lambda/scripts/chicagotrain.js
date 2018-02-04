module.exports = {
    ChicagoTrainNoSlots: function (stopCode,stopName,routeID,routeName, event,callback) {
        console.log("[ 2 ]     :  ChicagoTrainNoSlots()");
        var sessionAttributes = event.session.attributes;
        var cardTitle = "Green Bus: Train Arrival information for " + routeName[0];
        var cardContent;
         var rePromptText = "";        
        var endSessionTF = true;
        var speechOutput;        
        ChicagoTrainAPIQuery(stopCode, stopName, routeID[0], routeName[0], function(err1,speechOutput) {
            if (err1) { console.log("Error in  ChicagobusAPIQuery"); }            
            if (routeID.length > 1) { console.log("Trying for 2nd RouteID");           
                ChicagoTrainAPIQuery(stopCode, stopName, routeID[1], routeName[1], function(err2,data2) {                 
                    if (err2) { console.log("Error in ChicagoTrainAPIQuery 2nd time"); }
                    speechOutput += " . . " + data2;
                    cardContent = speechOutput + " \n " + "Stop Name :  " + stopName + ".\n\n To change default stop or route, disable this Alexa skill and enable it again";
                    cardTitle += " and " + routeName[1];
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
    ChicagoTrainWithSlots: function (stopCode,stopName,routeID,routeName, event,callback) {
        console.log("[ 2 ]     :  ChicagoTrainWithSlots()");
            if (routeID !== null ) {
            var sessionAttributes = event.session.attributes;
            var cardTitle = "Green Bus: Train Arrival information for " + routeName[0];
            var cardContent;
             var rePromptText = "";        
            var endSessionTF = true;
            var speechOutput;        
            ChicagoTrainAPIQuery(stopCode, stopName, routeID[0], routeName[0], function(err1,speechOutput) {
                if (err1) { console.log("Error in  ChicagobusAPIQuery"); }                
                if (routeID.length > 1) { console.log("Trying for 2nd RouteID");           
                    ChicagoTrainAPIQuery(stopCode, stopName, routeID[1], routeName[1], function(err2,data2) {                 
                        if (err2) { console.log("Error in ChicagoTrainAPIQuery 2nd time"); }
                        speechOutput += " . . " + data2;
                        cardContent = speechOutput + " \n " + "Stop Name :  " + stopName + ".\n\n To change default stop or route, disable this Alexa skill and enable it again";
                        cardTitle += " and " + routeName[1];
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
}; // --------------------------------------------------------------------------
function ChicagoTrainAPIQuery (stpid, stopName, rt, routeName, callback) {
    console.log("[ 2.1 ]   :  ChicagoTrainAPIQuery() > stpid=",stpid," | rt=",rt);    
    var moment = require('moment-timezone');
    moment.tz.setDefault("America/Chicago");
    var speechOutput= routeName + " is not in operation.";
    var http = require('http');    
    var getURL = "http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=a1193e42be8844c5b50c55d530eec1ab&stpid="+stpid+"&rt="+rt;    
    var req = http.request(getURL, function(res) {
        var httpResponseBody = ''; 
        res.setEncoding('utf8');
        res.on('data', function(chunk) { httpResponseBody += chunk;  });
        res.on('end', function() {
            console.log("httpResponseBody::",httpResponseBody);
            var xml2js = require('xml2js');
            var parser = xml2js.Parser({ explicitArray: true });
            parser.parseString(httpResponseBody, function (err, data) {
                if (err) { console.log("Error in Resposne from CTA Train"); speechOutput = "Unable to fetch data from Chicago Transport."; }
                else {
                    arrivalTime = new Array(); routeDirection = new Array(); destination = new Array();
                    if (data['ctatt']['errCd'].toString() === "0" )  { 
                        if (data['ctatt'].hasOwnProperty('eta')) { if (data['ctatt']['eta'].hasOwnProperty(0)) {
                        if (data['ctatt']['eta'][0].hasOwnProperty('arrT')) {                     
                            arrivalTime[0]      = moment(data['ctatt']['eta'][0]['arrT'].toString(),'YYYYMMDD HH:mm:ss', true).format();
                            routeDirection[0]   = data['ctatt']['eta'][0]['stpDe'].toString();
                            destination[0]      = data['ctatt']['eta'][0]['destNm'].toString();                        
                            speechOutput = routeName + " towards  " + destination[0] + " is arriving in " + moment().to(moment(arrivalTime[0]),true);
                            

                            if ( data['ctatt']['eta'].hasOwnProperty(1) ) {  
                            arrivalTime[1]      = moment(data['ctatt']['eta'][1]['arrT'].toString(),'YYYYMMDD HH:mm:ss', true).format();                              
                            speechOutput += ", , and again in " + moment().to(moment(arrivalTime[1]),true);                            
                            return callback(null,speechOutput);                                        
                            }
                    } } } }
                    if (data['ctatt']['errCd'].toString() !== "0" )  {
                        speechOutput = routeName + " is not in operation now.";
                    }
                    return callback(null,speechOutput);
                    }
            });
        });
        req.on('error', function(e) { console.log('problem with request: ' + e.message); }); 
    });                   
req.end();                        
} //
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