import ffmpeg from "fluent-ffmpeg"
import { subtitleExists } from "./fileManipulation"
import path from "path"

export function extractSubtitleTrack(inputFile, streamInfo, outputFile) {
  try {
    const command = new ffmpeg(inputFile, { logger: console.debug })
    command
      .on("start", function () {
       // console.log("Start: ", command)
       // console.log("=======================")
      })
      .outputOptions(
        `-map 0:${streamInfo.index}`
        // '-c:s:0',
        // 'webvtt'
      )
      .output(path.dirname(inputFile) + '/' + outputFile)
      .on("error", function (err, stdout, stderr) {
       console.log("=======================")
       console.log("An error occurred: " + err.message, err, stderr)
      })
      .on("end", function () {})
    command.run()
  } catch (e) {
    console.log(e, e.code, e.msg)
  }
}

export async function findSubtitles(movie) {
  console.log('=================')
  console.log('=================')
  console.log(movie)
  console.log('=================')
  console.log('=================')
  // Finding subtitles
  ffmpeg.ffprobe(movie, (err, metadata) => {
    let title
    if(metadata && metadata.format && metadata.format.tags && metadata.format.tags.title) {
      title = metadata.format.tags.title
    }else {
      title = path.parse(movie).name
    }
    const languages = {}
      console.log({movie})
      console.log({metadata})

    for (const stream of metadata.streams) {
      if (stream.codec_name.includes("subrip")) {
        let {language} = stream.tags
        if(!language) {
          language = 'eng'
        }
        let outputFile = ""

        // Keeping track of how many subtitles we have for one language
        if (languages[language] > 0) {
          languages[language] += 1
        } else {
          languages[language] = 1
        }

        outputFile = `${title}.${languages[language]}.${language}`

        const exists = subtitleExists(path.dirname(movie) + '/' + outputFile)
        if (!exists) {
          console.log('===============')
          console.log('extracting', outputFile)
          extractSubtitleTrack(movie, stream, outputFile + ".vtt")
        }
      }
    }
  })
}
