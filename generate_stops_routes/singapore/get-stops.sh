#!/bin/bash
# wget for OTtawa OC Transpo
rm /var/www/html/myCaptain/singapore/stops.txt
php /var/www/html/myCaptain/singapore/get-stops.php
cp stops.txt /var/www/html/myCaptain/singapore/
rm stops.txt
