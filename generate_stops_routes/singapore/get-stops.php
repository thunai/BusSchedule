<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

getBusStopData();

// *********************************************************************************************
// Function to GET data from LTA API 
function getBusStopData() {
    $isFirst50=true; $isLast50=0; $skipCount=0; $dataSkipSetting = NULL;
    do {
    if ( $isFirst50 == false ) { $dataSkipSetting = "?\$skip=".$skipCount; }
    $getBusStopListURL = 'http://datamall2.mytransport.sg/ltaodataservice/BusStops' . $dataSkipSetting;
    $getBusStopListHeaders = array(
        'http' => array(
        'header'  => "AccountKey: pbtXnB3DT92F7pv0M0mPJg==\r\nUniqueUserID: 4d30900e-fdaf-436c-850c-846d6ed26b97\r\nContent-type: application/json\r\n",
        'method'  => 'GET'
        ),
    );    
    $getBusStopContextGET = stream_context_create($getBusStopListHeaders);    
    $getBusStopResponseGET = file_get_contents($getBusStopListURL, true, $getBusStopContextGET);
    $getBusJSONArray = json_decode($getBusStopResponseGET,true); 
    static $valuesArray = array();
    $count001 = count($getBusJSONArray['value']);
    for($i=0;$i<$count001;$i++) {
        $BusStopCode = $getBusJSONArray['value'][$i]['BusStopCode'];
	$RoadName = $getBusJSONArray['value'][$i]['RoadName'];
	$Description = $getBusJSONArray['value'][$i]['Description'];
	$Latitude = $getBusJSONArray['value'][$i]['Latitude'];
	$Longitude = $getBusJSONArray['value'][$i]['Longitude'];        
        // Store Bus Stop in to associative array for each Street Name
            if (array_key_exists($RoadName, $valuesArray)) {
                $valuesArray[$RoadName][] = $BusStopCode;
                $valuesArray[$RoadName][] = $Description;                
            } else { 
                $valuesArray[$RoadName] = array();
                $valuesArray[$RoadName][] = $BusStopCode;
                $valuesArray[$RoadName][] = $Description;                
            }       
    } 
    $isLast50 = $count001;
    $skipCount=$skipCount+50;
    $isFirst50=false;
    sleep(5);
    } while ($isLast50 > 49);
    // Print count of Road Names and Bus Stops
    echo "SortBy-BusStopCode:: Count of Bus Stop   = ", $count001, "\n";
    echo "SortBy-StreetName::  Count of Road Names = ", count($valuesArray), "\n";
    echo "SortBy-StreetName::  Count of Bus Stops = ", count($valuesArray,COUNT_RECURSIVE)-count($valuesArray), "\n";
    
    // Store Street Names in to DynamoDB
    writeToFile($valuesArray);    
}

// *********************************************************************************************
// Function to GET data from LTA API 
function writeToFile($passedArray1) {
    $file1 = "stops.txt";
    foreach ($passedArray1 as $roadNames1 => $busStops1) {    
        $roadNames1 = $roadNames1 . ",";
        file_put_contents($file1, $roadNames1, FILE_APPEND);
            for($i=0;$i<count($busStops1);$i++) {
                if ($i !== (count($busStops1)-1)) { $busStops1[$i] = $busStops1[$i] . ","; }                
                file_put_contents($file1, $busStops1[$i], FILE_APPEND);
            }
        file_put_contents($file1, PHP_EOL, FILE_APPEND);    
        }        
}
// *********************************************************************************************

