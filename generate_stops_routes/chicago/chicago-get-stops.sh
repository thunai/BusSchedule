#!/bin/bash
# wget for OTtawa OC Transpo
wgetURL="http://www.transitchicago.com/downloads/sch_data/google_transit.zip"
wget $wgetURL
unzip -o google_transit.zip routes.txt stop_times.txt stops.txt trips.txt
rm google_transit.zip
cp stops.txt /var/www/html/myCaptain/chicagobus/stops.txt
cp stops.txt /var/www/html/myCaptain/chicagotrain/stops.txt
rm /var/www/html/myCaptain/chicagotrain/stoproutes.csv
rm /var/www/html/myCaptain/chicagobus/stoproutes.csv
node chicago-stoproutes.js
rm stops.txt
rm routes.txt
rm stop_times.txt
rm trips.txt
