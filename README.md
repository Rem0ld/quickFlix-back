# QuickFlix

- [ ] make a job that will not pressure too much the RPY, like 10s timeout after each, may be during the night
- [ ] find a way to extract subtitles from videos when present check with
  ```
  ffprobe -v error -of json input.mkv -of json -show_entries "stream=index:stream_tags=language" -select_streams s
  ```

## TODO

- [x] List all videos from hardrive, but only show mkv and mp4 in front
- [x] add them in the bdd
- [x] make a name shortener to keep only title and for tvshow season and episode
- [x] check audio codecs and reencode if necessary
- [x] Make Job to reencode audio
  - [x] job to find which video needs to reencode audio, but fluent-mmpeg was way slower than expected (3x)
  - [x] creation of a bash script to do it
    - [x] script
      - [x] with input file reading line
      - [ ] with pathname as argument
      - [ ] connected with node so node can send action
      - [ ] make node able to read logs to update jobs in bdd
- [ ] Extract subtitles
- [ ] websocket
- [ ] seed with user PierrotLeFou
- [ ] join video with watched
- [ ] use cookie to get user from the requests
