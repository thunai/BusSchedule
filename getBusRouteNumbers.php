<?php
$selectedStopCode = $_POST["FORMSelectedStop"];
$selectedCity = $_POST["FORMSelectedCity"];

// IF Selected City is Ottawa --------------------------------------------------
if ( $selectedCity == "ottawa") {
    $ottawaResultsArray = array();
    $ch = curl_init("https://api.octranspo1.com/v1.2/GetRouteSummaryForStop?appID=9283e2f1&apiKey=b150d06dcb622d45192d318daac92653&stopNo=" . $selectedStopCode);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    $ch_result = curl_exec($ch);
    curl_close($ch);
    $soap = simplexml_load_string($ch_result);
    $soap->registerXPathNamespace('ns1', "http://tempuri.org/");
    $productsResult = $soap->xpath('//ns1:Route');    
    foreach ($productsResult as $item) {   
        $ottawaResultsArray[] =  "[ " . $item->RouteNo . " ] : " . " heading to " . $item->RouteHeading;
    }
    echo json_encode($ottawaResultsArray);                
} // -----------------------------------------------------------------------------
// IF Selected City is Chicago Bus -----------------------------------------------
if ( $selectedCity == "chicagobus") {
    $chicabusResultsArray = array();   
    
    if (($handle = fopen("chicagobus/stoproutes.csv", "r")) !== FALSE) {
        while (($data = fgetcsv($handle, ",")) !== FALSE) {            
            if ($data[0] === $selectedStopCode) {
                $routeIDs = split(":", $data[1]);
                foreach ($routeIDs as $routeID) {
                    if ($routeID !== "") { array_push($chicabusResultsArray,$routeID); }
                }
            }
        }
    }         
    echo json_encode($chicabusResultsArray);
} // ---------------------------------------------------------------------------
// IF Selected City is Chicago Train -------------------------------------------
if ( $selectedCity == "chicagotrain") {   
    $chicatrainResultsArray = array();
    
    if (($handle = fopen("chicagotrain/stoproutes.csv", "r")) !== FALSE) {
        while (($data = fgetcsv($handle, ",")) !== FALSE) {            
            if ($data[0] === $selectedStopCode) {
                $routeIDs = split(":", $data[1]);
                foreach ($routeIDs as $routeID) {
                 if ($routeID !== "")    {    
                    if ($routeID == "P")     { $routeName = "Purple Line";}
                    if ($routeID == "Y")     { $routeName = "Yellow Line";}
                    if ($routeID == "Blue")  { $routeName = "Blue Line";  }
                    if ($routeID == "Pink")  { $routeName = "Pink Line";  }
                    if ($routeID == "G")     { $routeName = "Green Line"; }
                    if ($routeID == "Org")     { $routeName = "Orange Line"; }
                    if ($routeID == "Brn")   { $routeName = "Brown Line"; }
                    if ($routeID == "Red")   { $routeName = "Red Line"; }
                    $routeIDandName = "[ " . $routeID . " ] : " . $routeName;
                    array_push($chicatrainResultsArray,$routeIDandName); 
                  }
                }
            }
        }
    }  
    
echo json_encode($chicatrainResultsArray);    
} // ---------------------------------------------------------------------------
// IF Selected City is SINGAPORE -----------------------------------------------
if ( $selectedCity == "singapore") {
    $singaporeResultsArray = array();
    $singaporeURL = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrival?BusStopID=' . $selectedStopCode;
    $singaporeHeaders = array(
        'http' => array(
        'header'  => "AccountKey: pbtXnB3DT92F7pv0M0mPJg==\r\nUniqueUserID: 4d30900e-fdaf-436c-850c-846d6ed26b97\r\nContent-type: application/json\r\n",
        'method'  => 'GET'
        ),
    );    
    $singaporeContextGET = stream_context_create($singaporeHeaders);    
    $singaporeGETResponse = file_get_contents($singaporeURL, true, $singaporeContextGET);
    $singaporeJSONArray = json_decode($singaporeGETResponse,true);     
    $singaporeCountOfResults = count($singaporeJSONArray['Services']);
    for($i=0;$i<$singaporeCountOfResults;$i++) { $singaporeResultsArray[] = $singaporeJSONArray['Services'][$i]['ServiceNo']; }        
    echo json_encode($singaporeResultsArray);
} // ---------------------------------------------------------------------------
