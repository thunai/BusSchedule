<?php
$state = $_GET["state"]; 
$client_id = $_GET["client_id"];
$response_type = $_GET["response_type"];
?>
<html>
<head>
    <title>Green bus - Bus and Train Arrivals for Alexa</title>                
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/cupertino/jquery-ui.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
    

<script>       
$(function() { // ----- START --------------------------------------------------
$("#FORMSelectedCity").on('change', function() {  //  1 - Select City
    $("#FORMSelectedStop").val('');     $("#FORMSelectedStop2").val('');
    $("#FORMSelectedRoutes").val('');   $("#FORMSelectedRoutes2").val('');
    $("#DIVCheckbox").html('');         $("#DIVCheckbox2").html('');
    $("#DIVCheckbox_Warning").val('');
    //$("#DIVSubmit").hide();
    $("#DIVSelectRoutes").hide(); $("#DIVAnother").hide();             
    selectedCity = this.value;
    $.post( "getBusStopList.php", { FORMSelectedCity: this.value }, function( getStopList ) { // 2 - Get Stop List
        $("#DIVSelectStop").show();
        $("#FORMSelectedStop").autocomplete({ // 3 - Autocomplete Stop List 1
            source: getStopList,
            inLength: 2,
            select: function(event, selectedStop1) { // 4 - Selected Stop 1            
                    $.post("getBusRouteNumbers.php", {FORMSelectedStop: selectedStop1.item.value.split(" ")[1], FORMSelectedCity: $('#FORMSelectedCity').val() }, function( getRouteList1 ) { // 5 - Get Route List 1
                    var RouteIDs = JSON.parse(getRouteList1); $("#DIVCheckbox").empty();
                    for (i = 0; i < RouteIDs.length; i++) {  $( "<input class='FORMSelectedRoutes' name='FORMSelectedRoutes[]' type='checkbox' value='" + RouteIDs[i] + "'>" + RouteIDs[i]  + " </br>" ).appendTo( "#DIVCheckbox" ); } $("<br> <font face='arial' color='grey' size='2'>This is your default stop and route. To get arrival timings for this stop just say <br><em>Alexa, ask green bus for arrivals</em></font><br>" ).appendTo( "#DIVCheckbox" );
                    $("#DIVSelectRoutes").show(); $("#DIVCheckbox").show();
                    $('input.FORMSelectedRoutes').on('change', function() { // 6a - Selected Route 1
                    //$('#DIVCheckbox').on('change', function() { // 6a - Selected Route 1
                        $("#DIVAnother").show(); $("#DIVSubmit").show();                                    
                    });  // 6a - Selected Route 1
                    $('input.FORMSelectedRoutes').on('change', function() { // 6b
                        if($(this).siblings(':checked').length >= 2) { this.checked = false; $("#DIVCheckbox_Warning").html("<font color='red'>Max Two Route numbers per stop.</font>"); $("#DIVCheckbox_Warning").show(); }
                    }); // 6b
                    $('input[name=INPUTanotherStop]:radio').click(function() { //6c 
                        if($(this).val() === "yes") { // 6d
                            //$("#DIVSubmit").hide();
                            $("#DIVSelectStop2").show();
                            $("#FORMSelectedStop2").autocomplete({ //6e
                                source: getStopList,
                                inLength: 2,
                                select: function(event2, ui2) { //6f
                                    $("#DIVCheckbox2").show(); $("#DIVSelectRoutes2").show();                                                   
                                    $.post("getBusRouteNumbers.php", { FORMSelectedStop: ui2.item.value.split(" ")[1], FORMSelectedCity: $('#FORMSelectedCity').val() }, function( getRouteList2 ){   //6g                                                     
                                        $("#DIVCheckbox2").empty();                               
                                        for (i = 0; i < getRouteList2.length; i++) {  $( "<input class='FORMSelectedRoutes2' name='FORMSelectedRoutes2[]' type='checkbox' value='" + getRouteList2[i] + "'>" + getRouteList2[i]  + " </br>" ).appendTo( "#DIVCheckbox2" ); } $("<br> <font face='arial' color='grey' size='2'><em>Alexa, ask green bus for arrivals at second stop</em><font><br>" ).appendTo( "#DIVCheckbox2" );
                                        $('input.FORMSelectedRoutes2').on('change', function() { //6h
                                            $("#DIVSubmit").show();
                                            if($(this).siblings(':checked').length >= 2) { this.checked = false; $("#DIVCheckbox_Warning").html("<font color='red'>Max Two Route numbers per stop.</font>"); $("#DIVCheckbox_Warning").show(); }
                                        }); //6h
                                    }, "json"); //6g
                                } //6f
                            }); // 6e
                        } //6d
                    });  // 6c                              
                }); // 5 - Get Route List 1        
            } // 4 - Selected Stop 1      
        }); // 3 - Autocomplete Stop List 1                                     
    }, "json"); // 2 - Get Stop List      
}); // 1 - Select City
});//----- END -----------------------------------------------------------------
</script>    
</head>
<body> 
<div align="center"  class="ui-widget-header">
    <div align="center" class="ui-widget"><h2>Set Defaults for Green bus </h2></div>
</div>
<div align="center" class="ui-widget">
    <form action="submit.php" method="POST" name="signup" autocomplete="off">    
    <h3>Select your City</h3>    
    <select required autofocus autocomplete="off" id="FORMSelectedCity" name="FORMSelectedCity">
        <option value="" selected="selected">Select Your City</option>            
        <option value="ottawa">Ottawa OC Transport</option>            
        <option value="chicagobus">Chicago CTA Bus</option>
        <option value="chicagotrain">Chicago CTA Train</option>
        <option value="singapore">Singapore LTA</option>
    </select>
    
    <div id="DIVSelectStop" class="ui-widget" style="display:none;"> <p class="ui-widget-content">Choose your default stop</p> <input id="FORMSelectedStop" name="FORMSelectedStop" type="search" placeholder="Type Stop Name/ID..." onfocus="this.select();" onmouseup="return false;"></div>    

    <div id="DIVSelectRoutes" class="ui-widget" style="display:none;"> <p class="ui-widget-content">Choose Routes for default stop</p> </div>
    <div id="DIVCheckbox" class="ui-widget" style="display:none;"></div>

    <div id="DIVAnother" class="ui-widget" style="display:none;"> <p class="ui-widget-content"> Do you want to set another stop? </p>
        <input type="radio" id="INPUTanotherStop" name="INPUTanotherStop" value="no" checked> No<br>
        <input type="radio" id="INPUTanotherStop" name="INPUTanotherStop" value="yes"> Yes<br>
    </div>    
    
    <div id="DIVSelectStop2" class="ui-widget" style="display:none;"> <p class="ui-widget-content">Choose your second stop</p> <input id="FORMSelectedStop2" name="FORMSelectedStop2" type="search" placeholder="Type Stop Name/ID..." onfocus="this.select();" onmouseup="return false;"></div>
    <div id="DIVSelectRoutes2" style="display:none;"> <p class="ui-widget-content">Choose Routes for second stop</p> </div>
    <div id="DIVCheckbox2" style="display:none;"></div>
    
    <div id="DIVCheckbox_Warning" style="display:none;"></div>
    <br>
    
    <div id="DIVSubmit">
        <input class="ui-button" type="submit">
        <input type="hidden" name="state" value="<?php echo $state; ?>">
        <input type="hidden" name="client_id" value="<?php echo $client_id; ?>">
        <input type="hidden" name="response_type" value="<?php echo $response_type; ?>">
    </div>   
                       
    <div align="center" id="DIV_ID_Footer"><p align="center"> <font face="arial" size="2"> To change your selection later, just <em>disable</em> the Alexa skill and <em>enable</em> it again.</p> <br>GreenBus@ImpliedKarma.com </font> </div>

    </form>
</div>
</body>
</html>