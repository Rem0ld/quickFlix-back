# QuickFlix

- List all videos from hardrive, but only show mkv and mp4 in front
- add them in the bdd
- make a name shortener to keep only title and for tvshow season and episode
- check audio codecs and reencode if necessary
  - make a job that will not pressure too much the RPY, like 10 timeout after each, may be during the night
- find a way to extract subtitles from videos when present
  - check with ffprobe -v error -of json input.mkv -of json -show_entries "stream=index:stream_tags=language" -select_streams s
    - it gives us a nice json file with the different languages

TODO: fix when fetching only movies sending total of all videos
