#!/bin/bash

echo "Enter the number of weeks to run the daily job: "
read weeks

echo "0 0 */$weeks * * node extract.js" >> cron.tmp
crontab cron.tmp
rm cron.tmp
