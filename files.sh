#!/bin/bash

  # find $(pwd)/public/videos/* -regex '.*/*.[mkv|mp4|avi]' -not -path '*/Sample/*' -not -path '*/Extras/*' | head -n 10 | while read -r i
  # See readme, but we need to make this script to receive an argument and process it
  cat ./jobs/job | while read -r i
do
  echo "$i"
  # To capture basename without extension
  # and dirname + creation tempfile
  length=$((${#i} - 4))
  dirname=$(echo ${i%/*})
  basename=$(echo "${i##*/}")
  extension=${basename:(-3)}
  basename=$(echo ${basename:0:length})
  
  temp="temp.$extension"
  
  # Capturing PID and awaiting for process to finish
  ffmpeg -i "$i" -c:v copy -c:a libmp3lame -qscale:a 2 "$dirname/$temp" &
  PID=$!
  wait $PID

  # Checking if error
  result=$?
  if [[ $result != 0 ]]; then
    rm "$dirname/$temp"
    echo "$i" >> error_logs.txt
  else
   mv "$dirname/$temp" "$i" 
   echo $basename >> logs.txt
  fi

   sleep 120
done
