#!/bin/bash
# wget for OTtawa OC Transpo
wgetURL="http://www.octranspo1.com/files/google_transit.zip"
wget $wgetURL
unzip -o google_transit.zip stops.txt
cp stops.txt /var/www/html/myCaptain/ottawa/stops.txt
rm google_transit.zip
rm stops.txt
