var csv = require("fast-csv");
var fs = require('fs');
var res1 = {};
var res2 = {};
var res3 = {};
var res4 = {};

first();
second();

//==============================================================================
function first() {
    var stream = fs.createReadStream("stop_times.txt");
    csv
    .fromStream(stream)
    .on("data", function(data){    
        tripID = data[0]; stopID = data[3];
        if (stopID in res1) {       res1[stopID].push(tripID); }
        else { res1[stopID] = [];   res1[stopID].push(tripID); } 
        })
    .on("end", function(){
        //console.log("done first");       
        consolidate1();
    });    
} // ---------------------------------------------------------------------------    
function second() {   
   csv
    .fromPath("trips.txt")
    .on("data", function(data){    
        routeID = data[0]; tripID = data[2];                 
        if (tripID in res2) {       res2[tripID].push(routeID); }
        else { res2[tripID] = [];   res2[tripID].push(routeID); } 
    })
    .on("end", function(){
    //console.log("done second");                 
    });
} // ---------------------------------------------------------------------------  
function consolidate1() {    
    //console.log("(Consolidate) Count of keys in res1=", Object.keys(res1).length);
    //console.log("(Consolidate) Count of keys in res2=", Object.keys(res2).length);
    //console.log("(Consolidate) Count of keys in res3=", Object.keys(res3).length);
    Array.prototype.contains = function(element){
        return this.indexOf(element) > -1;
        };
    for (var stopID in res1) {        
        res1[stopID].forEach(function(tripID) {            
        //console.log(tripID, ">>", res2[tripID]);
        if (   stopID in res3  ) {  res3[stopID].push(res2[tripID]);                    }
        if ( !(stopID in res3) ) {  res3[stopID] = []; res3[stopID].push(res2[tripID]); }            
       });
    }  
 setTimeout(uniq,20000);
} // ---------------------------------------------------------------------------
function uniq() {
    for (var stopID in res3) {
        var distinct = [];        
        res3[stopID].forEach(function(routeID) {
            if (typeof routeID != undefined && routeID != null) {
                if (distinct.contains(routeID.toString()) === false) { distinct.push(routeID.toString()); }
            }
        });
        res4[stopID] = distinct;     
    }     
 setTimeout(exit2,20000);
} // --------------------------------------------------------------------------- 
function exit2() {    
    //console.log("(Exit) Count of keys in res1=", Object.keys(res1).length);
    //console.log("(Exit) Count of keys in res2=", Object.keys(res2).length);
    //console.log("(Exit) Count of keys in res3=", Object.keys(res3).length);
    var fsDataBus    = ["stopID", "routeID", "\r\n"]; 
    var fsDataTrain  = ["stopID", "routeID", "\r\n"]; 
    for (var stopID in res4) {
        if (stopID < 30000) {
            fsDataBus += stopID + ",";
            res4[stopID].forEach(function(routeID) {                
                fsDataBus += routeID + ":";
            });         
            fsDataBus += "\r\n";
        }
        if (stopID > 29999) {
            fsDataTrain += stopID + ",";
            res4[stopID].forEach(function(routeID) {                
                fsDataTrain += routeID + ":";
            });         
            fsDataTrain += "\r\n";
        }        
    }
 setTimeout(writeToFileBus(fsDataBus)    ,20000);
 setTimeout(writeToFileTrain(fsDataTrain),20000);
} // ---------------------------------------------------------------------------  
function writeToFileBus(fsDataBus) {
    fs.writeFile("/var/www/html/myCaptain/chicagobus/stoproutes.csv", fsDataBus, function(err) {
        if (err) { console.log(err); }
        //console.log('The "data to append" was appended to file!');
      });
} // ---------------------------------------------------------------------------
function writeToFileTrain(fsDataTrain) {
    fs.writeFile("/var/www/html/myCaptain/chicagotrain/stoproutes.csv", fsDataTrain, function(err) {
        if (err) { console.log(err); }
        //console.log('The "data to append" was appended to file!');
      });
} // ---------------------------------------------------------------------------
