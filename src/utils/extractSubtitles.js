import ffmpeg from "fluent-ffmpeg";
import { subtitleExists } from "./fileManipulation";
import path from "path";
import { subtitleModel } from "../schemas/Subtitles";

export async function extractSubtitleTrack(
  inputFile,
  streamInfo,
  outputFile,
  name,
  isTvShow,
  season,
  episode
) {
  try {
    const command = new ffmpeg(inputFile, { logger: console.debug });
    command
      .on("start", function () {})
      .outputOptions(
        `-map 0:${streamInfo.index}`
        // '-c:s:0',
        // 'webvtt'
      )
      .output(path.dirname(inputFile) + "/" + outputFile)
      .on("error", function (err, stdout, stderr) {
        console.log("=======================");
        console.log("An error occurred: " + err.message, err, stderr);
      })
      .on("end", async function () {});
    command.run();
  } catch (e) {
    console.log(e, e.code, e.msg);
  }
}

export async function findSubtitles(movie, name, isTvShow, season, episode) {
  ffmpeg.ffprobe(movie, async (err, metadata) => {
    // let title;
    // if (metadata && metadata.format && metadata.format.tags && metadata.format.tags.title) {
    //   title = metadata.format.tags.title;
    // } else {
    //   title = path.parse(movie).name;
    // }
    if (err) throw new Error(err);

    const languages = {};

    try {
      for (const stream of metadata.streams) {
        if (stream.codec_name.includes("subrip")) {
          let { language } = stream.tags;
          if (!language) {
            language = "eng";
          }
          let outputFile = "";

          // Keeping track of how many subtitles we have for one language
          if (languages[language] > 0) {
            languages[language] += 1;
          } else {
            languages[language] = 1;
          }

          if (isTvShow) {
            outputFile = `${name}.S${season}E${episode}.${languages[language]}.${language}`;
          } else {
            outputFile = `${name}.${languages[language]}.${language}`;
          }

          const exists = subtitleExists(path.dirname(movie) + "/" + outputFile);
          if (!exists) {
            console.log("===============");
            console.log("extracting", outputFile);
            const data = await extractSubtitleTrack(
              movie,
              stream,
              outputFile + ".vtt",
              name,
              isTvShow,
              season,
              episode
            );
            console.log(data);
          }
          return "";
        }
      }
    } catch (error) {
      console.log("in catch from findSubtitles", error);
    }
  });
}
