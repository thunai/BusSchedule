<?php
require_once('vendor/autoload.php'); // RSS parser
use Aws\DynamoDb\DynamoDbClient;

$FORM_SelectedCity = $_POST["FORMSelectedCity"]; 
$state = $_POST["state"];
$client_id = $_POST["client_id"]; 
$response_type = $_POST["response_type"]; 
$accessToken = mktime() + mt_rand();
echo "state =$state <br>  client_id = $client_id <br> response_type = $response_type <br> ";
echo " ------------------------------------------------------------------------<br>";


    
if ($FORM_SelectedCity === "chicagobus") {
    chicagobus_AWSput($accessToken);
    $redirectURL = "Location: https://pitangui.amazon.com/spa/skill/account-linking-status.html?vendorId=M14NVLOE965M3F#state=" . $state . "&access_token=" . $accessToken . "&token_type=Bearer"; 
    header($redirectURL); /* Redirect browser */
    exit();
}
if ($FORM_SelectedCity === "singapore") {
    singapore_AWSput($accessToken);
    $redirectURL = "Location: https://pitangui.amazon.com/spa/skill/account-linking-status.html?vendorId=M14NVLOE965M3F#state=" . $state . "&access_token=" . $accessToken . "&token_type=Bearer"; 
    header($redirectURL); /* Redirect browser */
    exit();
}
if ($FORM_SelectedCity === "ottawa") {
    ottawa_AWSput($accessToken);
    $redirectURL = "Location: https://pitangui.amazon.com/spa/skill/account-linking-status.html?vendorId=M14NVLOE965M3F#state=" . $state . "&access_token=" . $accessToken . "&token_type=Bearer"; 
    header($redirectURL); /* Redirect browser */
    exit();
}
if ($FORM_SelectedCity === "chicagotrain") {    
    chicagotrain_AWSput($accessToken);
    $redirectURL = "Location: https://pitangui.amazon.com/spa/skill/account-linking-status.html?vendorId=M14NVLOE965M3F#state=" . $state . "&access_token=" . $accessToken . "&token_type=Bearer"; 
    header($redirectURL); /* Redirect browser */
    exit();
}
// ------------------------------------------------------------------------------------------
function chicagobus_AWSput($accessToken) {
    $subscription = "chicagobus";
    $stopCode     = explode(" ]", (explode("[ ", $_POST["FORMSelectedStop"])[1]) )[0];
    $stopName     = explode("] : ", $_POST["FORMSelectedStop"])[1];
    if (!empty($_POST['FORMSelectedRoutes']))  { foreach ($_POST['FORMSelectedRoutes']  as $serviceNos)  {  $routeID[]  = $serviceNos;  }  }
    
    if ( !empty($_POST["FORMSelectedStop2"]) ) { $stopCode2 = explode(" ]", (explode("[ ", $_POST["FORMSelectedStop2"])[1]) )[0]; $stopName2    = explode("] : ", $_POST["FORMSelectedStop2"])[1]; }
    if ( empty($_POST["FORMSelectedStop2"]) )  { $stopCode2 = null; $stopName2 = null; }    
    if (!empty($_POST['FORMSelectedRoutes2'])) { foreach ($_POST['FORMSelectedRoutes2'] as $serviceNos2) {  $routeID2[] = $serviceNos2; }  }
    if (empty($_POST['FORMSelectedRoutes2']))  { $routeID2 = null; }
    $routeName = null; $routeName2 = null;
    
    //echo "Subscription = $subscription <br> accessToken =$accessToken <br> chicagobusStopCode =$stopCode <br> chicagobusStopName =$stopName <br> chicagobusRouteID = $routeID <br> chicagobusStopCode2 =$stopCode2 <br> chicagobusStopName2 =$stopName2 <br> chicagobusRouteID2 =$routeID <br>";
    //echo " ------------------------------------------------------------------------<br>";

        
    $client = new DynamoDbClient([
        'region'  => 'us-east-1',
        'version' => 'latest'        
    ]);
    try {
         $putResponse = $client->putItem([
            'TableName' => 'myCaptain_UserDB',
            'Item' => array (
                'AccessToken'           => array('S'  => strval($accessToken)     ), // Primary Key    
                'Subscription'          => array('S'  => $subscription            ),
                'chicagobusStopCode'    => array('S'  => $stopCode                ),
                'chicagobusStopName'    => array('S'  => $stopName                ),
                'chicagobusRouteID'     => array('S'  => json_encode($routeID)    ),                
                'chicagobusRouteName'   => array('S'  => json_encode($routeName)  ),
                'chicagobusStopCode2'   => array('S'  => json_encode($stopCode2)  ),
                'chicagobusStopName2'   => array('S'  => json_encode($stopName2)  ),
                'chicagobusRouteID2'    => array('S'  => json_encode($routeID2)   ),
                'chicagobusRouteName2'  => array('S'  => json_encode($routeName2) )
               )
            ]);   
        echo "Status Code from putResponse = ", $putResponse['@metadata']['statusCode'] , "\n";
        } catch (Exception $e) { echo $e->getMessage(); }
 }
 // ---------------------------------------------------------------------------------------------------------------------
 function singapore_AWSput($accessToken) {
    $subscription = "singapore";
    $stopCode     = explode(" ]", (explode("[ ", $_POST["FORMSelectedStop"])[1]) )[0];
    $stopName     = explode("] : ", $_POST["FORMSelectedStop"])[1]; 
    if (!empty($_POST['FORMSelectedRoutes']))  { foreach ($_POST['FORMSelectedRoutes']  as $serviceNos)  {  $routeID[]  = $serviceNos;  }  }
    
    if ( !empty($_POST["FORMSelectedStop2"]) ) { $stopCode2 = explode(" ]", (explode("[ ", $_POST["FORMSelectedStop2"])[1]) )[0]; $stopName2 = explode("] : ", $_POST["FORMSelectedStop2"])[1]; }
    if ( empty($_POST["FORMSelectedStop2"]) )  { $stopCode2 = null; $stopName2 = null; }     
    if (!empty($_POST['FORMSelectedRoutes2'])) { foreach ($_POST['FORMSelectedRoutes2'] as $serviceNos2) {  $routeID2[] = $serviceNos2; }  }   
    if (empty($_POST['FORMSelectedRoutes2']))  { $routeID2 = null; }
    $routeName = null; $routeName2 = null;   
    
    //echo "Subscription = $subscription <br> accessToken =$accessToken <br> chicagobusStopCode =$stopCode <br> chicagobusStopName =$stopName <br> chicagobusRouteID = $routeID <br> chicagobusStopCode2 =$stopCode2 <br> chicagobusStopName2 =$stopName2 <br> chicagobusRouteID2 =$routeID <br>";
    //echo " ------------------------------------------------------------------------<br>";

    $client = new DynamoDbClient([
        'region'  => 'us-east-1',
        'version' => 'latest'        
    ]);
    try {
         $putResponse = $client->putItem([
            'TableName' => 'myCaptain_UserDB',
            'Item' => array (
                'AccessToken'          => array('S'  => strval($accessToken)     ), // Primary Key    
                'Subscription'         => array('S'  => $subscription            ),
                'singaporeStopCode'    => array('S'  => $stopCode                ),
                'singaporeStopName'    => array('S'  => $stopName                ),                
                'singaporeRouteID'     => array('S'  => json_encode($routeID)    ),
                'singaporeRouteName'   => array('S'  => json_encode($routeName)  ),
                'singaporeStopCode2'   => array('S'  => json_encode($stopCode2)  ),
                'singaporeStopName2'   => array('S'  => json_encode($stopName2)  ),                
                'singaporeRouteID2'    => array('S'  => json_encode($routeID2)   ),                
                'singaporeRouteName2'  => array('S'  => json_encode($routeName2) )
                )
            ]);   
        echo "Status Code from putResponse = ", $putResponse['@metadata']['statusCode'] , "\n";
        } catch (Exception $e) { echo $e->getMessage(); }
 }
 // ---------------------------------------------------------------------------------------------------------------------
function ottawa_AWSput($accessToken) {
    $subscription = "ottawa";
    $stopCode     = explode(" ]", (explode("[ ", $_POST["FORMSelectedStop"])[1]) )[0];
    $stopName     = explode("] : ", $_POST["FORMSelectedStop"])[1];
    if (!empty($_POST['FORMSelectedRoutes']))  { foreach ($_POST['FORMSelectedRoutes']  as $serviceNos)  {  $routeID[]  = explode(" ", explode(" ]",$serviceNos)[0])[1];  }  }
    
    if ( !empty($_POST["FORMSelectedStop2"]) ) { $stopCode2 = explode(" ]", (explode("[ ", $_POST["FORMSelectedStop2"])[1]) )[0]; $stopName2 = explode("] : ", $_POST["FORMSelectedStop2"])[1]; }
    if ( empty($_POST["FORMSelectedStop2"]) )  { $stopCode2 = null; $stopName2= null; }
    if (!empty($_POST['FORMSelectedRoutes2'])) { foreach ($_POST['FORMSelectedRoutes2'] as $serviceNos2) {  $routeID2[] = explode(" ", explode(" ]",$serviceNos2)[0])[1]; }  }    
    if (empty($_POST['FORMSelectedRoutes2'])) { $routeID2 = null; }
    $routeName = null; $routeName2 = null;
    
    // echo "Subscription = $subscription <br> accessToken =$accessToken <br> chicagobusStopCode =$stopCode <br> chicagobusStopName =$stopName <br> chicagobusRouteID = $routeID <br> chicagobusStopCode2 =$stopCode2 <br> chicagobusStopName2 =$stopName2 <br> chicagobusRouteID2 =$routeID <br>";
    // echo " ------------------------------------------------------------------------<br>";

    $client = new DynamoDbClient([
        'region'  => 'us-east-1',
        'version' => 'latest'        
    ]);
    try {
         $putResponse = $client->putItem([
            'TableName' => 'myCaptain_UserDB',
            'Item' => array (
                'AccessToken'        => array('S' => strval($accessToken)     ), // Primary Key    
                'Subscription'       => array('S' => $subscription            ),
                'ottawaStopCode'     => array('S' => $stopCode                ),
                'ottawaStopName'     => array('S' => $stopName                ),
                'ottawaRouteID'      => array('S' => json_encode($routeID)    ),
                'ottawaRouteName'    => array('S' => json_encode($routeName)  ),
                'ottawaStopCode2'    => array('S' => json_encode($stopCode2)  ),
                'ottawaStopName2'    => array('S' => json_encode($stopName2)  ),
                'ottawaRouteID2'     => array('S' => json_encode($routeID2)   ),
                'ottawaRouteName2'   => array('S' => json_encode($routeName2) )
                )
            ]);   
        echo "Status Code from putResponse = ", $putResponse['@metadata']['statusCode'] , "\n";
        } catch (Exception $e) { echo $e->getMessage(); }
 }  // ------------------------------------------------------------------------------------------
function chicagotrain_AWSput($accessToken) {
    $subscription = "chicagotrain";
    $stopCode     = explode(" ]", (explode("[ ", $_POST["FORMSelectedStop"])[1]) )[0];
    $stopName     = explode("] : ", $_POST["FORMSelectedStop"])[1];
    if (!empty($_POST['FORMSelectedRoutes']))  { foreach ($_POST['FORMSelectedRoutes']  as $serviceNos)  {   $routeID[]  = split(" ",$serviceNos)[1];  $routeName[]  = split(" : ",$serviceNos)[1];  }  }
    
    if ( !empty($_POST["FORMSelectedStop2"]) ) { $stopCode2    = explode(" ]", (explode("[ ", $_POST["FORMSelectedStop2"])[1]) )[0]; $stopName2    = explode("] : ", $_POST["FORMSelectedStop2"])[1]; }
    if ( !empty($_POST["FORMSelectedStop2"]) ) { $stopCode2 = null; $stopName2 = null; }
    if (!empty($_POST['FORMSelectedRoutes2'])) { foreach ($_POST['FORMSelectedRoutes2'] as $serviceNos2) {   $routeID2[] = split(" ",$serviceNos2)[1]; $routeName2[] = split(" : ",$serviceNos2)[1]; }  }
    if (empty($_POST['FORMSelectedRoutes2'])) { $routeID2 = null; $routeName2 = null; }
    
    // echo "Subscription = $subscription <br> accessToken =$accessToken <br> chicagobusStopCode =$stopCode <br> chicagobusStopName =$stopName <br> chicagobusRouteID = $routeID <br> chicagobusStopCode2 =$stopCode2 <br> chicagobusStopName2 =$stopName2 <br> chicagobusRouteID2 =$routeID <br>";
    // echo " ------------------------------------------------------------------------<br>";

    $client = new DynamoDbClient([
        'region'  => 'us-east-1',
        'version' => 'latest'        
    ]);
     try {
         $putResponse = $client->putItem([
            'TableName' => 'myCaptain_UserDB',
            'Item' => array (
                'AccessToken'             => array('S'     => strval($accessToken)     ), // Primary Key    
                'Subscription'            => array('S'     => $subscription            ),
                'chicagotrainStopCode'    => array('S'     => $stopCode                ),                
                'chicagotrainStopName'    => array('S'     => $stopName                ),                
                'chicagotrainRouteID'     => array('S'     => json_encode($routeID)    ),
                'chicagotrainRouteName'   => array('S'     => json_encode($routeName)  ),
                'chicagotrainStopCode2'   => array('S'     => json_encode($stopCode2)  ),                
                'chicagotrainStopName2'   => array('S'     => json_encode($stopName2)  ),                
                'chicagotrainRouteID2'    => array('S'     => json_encode($routeID2)   ),
                'chicagotrainRouteName2'  => array('S'     => json_encode($routeName2) )                
                )
            ]);   
        echo "Status Code from putResponse = ", $putResponse['@metadata']['statusCode'] , "\n";
        } catch (Exception $e) { echo $e->getMessage(); }
   
 } // ---------------------------------------------------------------------------------------------------------------------

