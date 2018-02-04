<?php
$selectedCity = $_POST["FORMSelectedCity"];

// IF Selected City is Ottawa --------------------------------------------------
if ( $selectedCity == "ottawa") {     
   $ottawaBusStopList = array();   
   if (($handle = fopen("ottawa/stops.txt", "r")) !== FALSE) {
        while (($data = fgetcsv($handle, ",")) !== FALSE) {
            $temp_string2 = "[ " . $data[1] . " ] : " . $data[2];                
            array_push($ottawaBusStopList,$temp_string2);            
            }        
        }
        fclose($handle);        
    echo json_encode($ottawaBusStopList);
} // ---------------------------------------------------------------------------
// IF Selected City is Chicaga Bus for Bus Stop List ---------------------------
if ( $selectedCity == "chicagobus") {    
    $chicagobusStopList = array();    
 
    if (($handle = fopen("chicagobus/stops.txt", "r")) !== FALSE) {
        while (($data = fgetcsv($handle, ",")) !== FALSE) {            
            if ($data[0] < 29999) {
                $temp_string2 = "[ " . $data[0] . " ] : " . $data[2];                
                array_push($chicagobusStopList,$temp_string2);
                }
            }        
        }
        fclose($handle);        
    echo json_encode($chicagobusStopList);
} // ---------------------------------------------------------------------------
// IF Selected City is Chicago Train--------------------------------------------
if ( $selectedCity == "chicagotrain") {
  $chicagoTrainStopList = array();    
     if (($handle = fopen("chicagotrain/stops.txt", "r")) !== FALSE) {
        while (($data = fgetcsv($handle, ",")) !== FALSE) {            
                if ($data[0] > 29999) {
                    $temp_string2 = "[ " . $data[0] . " ] : " . $data[2];                
                    array_push($chicagoTrainStopList,$temp_string2);
                }
            }        
        }
        fclose($handle);        
      echo json_encode($chicagoTrainStopList);
} // ---------------------------------------------------------------------------
// IF Selected City is SINGAPORE -----------------------------------------------
if ( $selectedCity == "singapore") {
$singaporeBusStopList = array();
    if (($handle = fopen("singapore/stops.txt", "r")) !== FALSE) {        
            while (($data = fgetcsv($handle, ",")) !== FALSE) {
                $num = count($data);
                for ($c=1; $c < $num; $c=$c+2) {            
                    $temp_string2 = "[ " . $data[$c] . " ] : " . $data[$c+1] . " at " . $data[0];                    
                    array_push($singaporeBusStopList,$temp_string2);            
                }        
            }
            fclose($handle);
        }    
    echo json_encode($singaporeBusStopList);
} // ---------------------------------------------------------------------------
