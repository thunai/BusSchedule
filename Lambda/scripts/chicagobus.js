module.exports = {    
  ChicagobusNoSlots: function (stopCode,stopName,routeID,routeName,event,callback) {
        console.log("[ 2 ]     :  ChicagobusNoSlots()");
        var sessionAttributes = event.session.attributes;
        var cardTitle = "Green Bus: Bus Arrival information for Bus " + routeID[0];
        var cardContent; 
        var rePromptText = "";  var endSessionTF = true;
        var speechOutput;        
        ChicagobusAPIQuery(stopCode,routeID[0], function(err1,speechOutput) {
            if (err1) { console.log("Error in  ChicagobusAPIQuery"); }            
            if (routeID.length > 1) {               
                ChicagobusAPIQuery(stopCode,routeID[1], function(err2,data2) {                   
                    if (err2) { console.log("Error in ChicagobusAPIQuery 2nd time"); }
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
   ChicagobusWithSlots: function (stopCode,stopName,routeID,routeName,event,callback) {
        console.log("[ 2 ]     :  ChicagobusWithSlots()");
        if (routeID !== null ) {
            var sessionAttributes = event.session.attributes;
            var cardTitle = "Green Bus: Bus Arrival information for Bus " + routeID[0];
            var cardContent; 
            var rePromptText = "";  var endSessionTF = true;
            var speechOutput;        
            ChicagobusAPIQuery(stopCode,routeID[0], function(err1,speechOutput) {
                if (err1) { console.log("Error in  ChicagobusAPIQuery"); }                
                if (routeID.length > 1) {               
                    ChicagobusAPIQuery(stopCode,routeID[1], function(err2,data2) {                   
                        if (err2) { console.log("Error in ChicagobusAPIQuery 2nd time"); }
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
            var cardContent = "You have not set this stop and route yet. To select a stop and route, disable this Alexa skill and enable it again";
            var rePromptText = ""; var endSessionTF = true;
            var speechOutput =  "You have not set this stop and route yet. To select a stop and route, disable this Alexa skill and enable it again";
            return callback(sessionAttributes, buildSpeechletResponse(cardTitle, cardContent, speechOutput, rePromptText, endSessionTF));    
        } 
    } 
}; // --------------------------------------------------------------------------
var ChicagobusAPIQuery = function (stpid, rt, callback) {
    console.log("[ 2.1 ]   :  ChicagobusAPIQuery() > stpid=",stpid," | rt=",rt);    
    var moment = require('moment-timezone');
    moment.tz.setDefault("America/Chicago");
    var speechOutput="Unable to get information for bus " + rt + " . . Try again later.";
    var http = require('http');    
    var getURL = "http://www.ctabustracker.com/bustime/api/v1/getpredictions?key=KAF3vpszqKsvLTGx7aTyWjsae&rt="+rt+"&stpid="+stpid;    
    var req = http.request(getURL, function(res) {
        var httpResponseBody = ''; 
        res.setEncoding('utf8');
        res.on('data', function(chunk) { httpResponseBody += chunk;  });
        res.on('end', function() {
            console.log("httpResponseBody::",httpResponseBody);
            var xml2js = require('xml2js');
            var parser = xml2js.Parser({ explicitArray: true });
            parser.parseString(httpResponseBody, function (err, data) {
                if (err) { console.log("Error in XML Resposne from CTA"); speechOutput = "Unable to fetch data at this time from Chicago transport."; }
                else {              
                    arrivalTime = new Array(); routeDirection = new Array(); destination = new Array();
                    if (data['bustime-response'].hasOwnProperty('error')) { console.log("error FOUND and is=",data['bustime-response']['error']);
                        speechOutput = "Bus " + rt + " is not in operation.";
                    }
                    if (!data['bustime-response'].hasOwnProperty('error')) { console.log("error NOT FOUND");
                        if (data['bustime-response']['prd'].hasOwnProperty(0)) { 
                            arrivalTime[0]      = moment(data['bustime-response']['prd'][0]['prdtm'].toString(),'YYYYMMDD HH:mm', true).format();
                            routeDirection[0]   = data['bustime-response']['prd'][0]['rtdir'].toString();
                            destination[0]      = data['bustime-response']['prd'][0]['des'].toString();                                            
                            speechOutput = "Bus " + rt + " is arriving in " + moment().to(moment(arrivalTime[0]),true);
                        }                        
                        if (data['bustime-response']['prd'].hasOwnProperty(1)) { 
                            arrivalTime[1]      = moment(data['bustime-response']['prd'][1]['prdtm'].toString(),'YYYYMMDD HH:mm', true).format();
                            speechOutput += ", and again in " + moment().to(moment(arrivalTime[1]),true);
                            return callback(null,speechOutput);
                        }
                    }
                    return callback(null,speechOutput);
                }
            });
        req.on('error', function(e) { console.log('problem with request: ' + e.message); });                            
        });
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
        