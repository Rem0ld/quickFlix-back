export const matchExt = /(\w+)$/i;
export const matchLng = /(\w+).\w+$/;
// Look for s01e01 | 1x01 | 101 - Removes number x264, h264 etc and quality 720p 1080p etc
export const regexTvShow =
  /s(\d{1,2})e(\d{1,2})|(\d{1,})x(\d{1,})|(?<!x|h|\d)(\d{1})(\d{2})(?!p|\d)/i;
export const regExBasename =
  /([ .\w']+?)(Season|$|-|mp3|[s|S]\d{1,}|\(.*\)|[A-Z]{2,}|\W\d{4}\W?.*)/;
export const regexIsSubtitle = /(vtt|srt|sfv)/i;
