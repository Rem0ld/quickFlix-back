#!/bin/bash

pathname=$1

# If no arg we return 1
if [[ -z "$pathname" ]]; then
  echo 'no argument provided'
  exit 1
fi
echo "$pathname"
# If file doesn't exists we return 1
if [[ -f "$pathname" ]]; then
  echo 'File exists'
else
  echo "File doesn't exists"
  exit 1
fi

  # To capture basename without extension
  # and dirname + creation tempfile
  length=$((${#pathname} - 4))
  dirname=$(echo ${pathname%/*})
  basename=$(echo "${pathname##*/}")
  extension=${basename:(-3)}
  basename=$(echo ${basename:0:length})
  
  temp="temp.$extension"
  
  # Capturing PID and awaiting for process to finish
  ffmpeg -i "$pathname" -c:v copy -c:a libmp3lame -qscale:a 2 "$dirname/$temp" &
  PID=$!
  wait $PID

  # Checking if error
  result=$?
  if [[ $result != 0 ]]; then
   rm "$dirname/$temp"
    echo "$pathname" >> error_logs.txt
  else
   mv "$dirname/$temp" "$pathname" 
   echo $basename >> logs.txt
  fi

exit 0
 
