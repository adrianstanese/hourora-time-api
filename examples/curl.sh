#!/bin/sh
# sh examples/curl.sh
B=https://hourora.app/api/v1
curl -s "$B/time?tz=Europe/London"
curl -s "$B/convert?from=Europe/London&to=Asia/Tokyo&time=2027-03-28T09:00"
curl -s "$B/zones?country=CA"
curl -s "$B/zones/Europe/Bucharest?year=2027"
curl -s "$B/cities?q=paris&limit=2"
curl -s "$B/lookup?lat=44.43&lng=26.10"
curl -s "$B/tzdata"
