#!/bin/bash
# uptime.sh
# get uptime from /proc/uptime

uptime=$(</proc/uptime)
uptime=${uptime%%.*}

seconds=$(( uptime%60 ))
minutes=$(( uptime/60%60 ))
hours=$(( uptime/60/60%24 ))
days=$(( uptime/60/60/24 ))



# echo "$days days $hours hours $minutes minutes $seconds seconds"
# echo " $days days, $hours hrs, $minutes mins, $seconds secs"
echo $(( uptime*1000 ))