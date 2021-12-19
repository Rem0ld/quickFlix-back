import fs, {access, constants} from 'fs'
import path from 'path'
import mime from 'mime'
import ffmpeg from 'fluent-ffmpeg'
import winston from 'winston/lib/winston/config';
import { loggers } from 'winston';

function extractSubtitleTrack(inputFile, streamInfo, outputFile) {
  // console.log('=======================');
  // console.log(inputFile);
  // console.log('=======================');
  // console.log(streamInfo);
  // console.log('=======================');
  // console.log(outputFile);
  try {
      const command = new ffmpeg(inputFile, { logger: console.debug } );
          command
          .on('start', function(command) {
            console.log('Start: ', command);
            console.log('=======================');
          })
          // .noAudio()
          // .noVideo()
          .outputOptions(
            `-map 0:${streamInfo.index}`,
            // '-c:s:0',
            // 'webvtt'
          )
          .output(path.resolve('./public/' + outputFile))
          .on('error', function(err, stdout, stderr) {
              console.log('=======================');
              console.log('An error occurred: ' + err.message, err, stderr);
          })
          .on('end', function() {
              
          });
          command.run();

  } catch (e) {
      console.log(e);
      console.log(e.code);
      console.log(e.msg);
  }

}

export default class ApiController {
  stream = async (req, res, next) => {
    const params = req.params;
    const movie = path.resolve("./public/" + req.params.filename);

    // Check if the file exists in the current directory.
    access(movie, constants.F_OK, (err) => {
      console.log(`${movie} ${err ? 'does not exist' : 'exists'}`);
    });

    fs.stat(movie, function (err, stats) {
      var range = req.headers.range;
      
      if (!range) {
        return res.sendStatus(416);
      }

      // Finding subtitles
      ffmpeg.ffprobe(movie, (err, metadata) => {
        const title = metadata.format.tags.title
        const languages = {}
        
        metadata.streams.forEach((element) => {
          if(element.codec_name.includes('subrip') ) {
            const language = element.tags.language
            let outputFile = ''

            // Keeping track of how many subtitles we have for one language
            if(languages[language] > 0) {
              languages[language] += 1
            }else {
              languages[language] = 1
            }
            
            outputFile = `${title}.${languages[language]}.${language}.vtt`
            // console.log(languages, languages[language])

            extractSubtitleTrack(movie, element, outputFile);
          }
        });
      })
      
      // Chunk logic here
      var positions = range.replace(/bytes=/, "").split("-");
      var start = parseInt(positions[0], 10);
      var total = stats.size;
      var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      var chunksize = end - start + 1;

      res.writeHead(206, {
        "Transfer-Encoding": "chunked",

        "Content-Range": "bytes " + start + "-" + end + "/" + total,

        "Accept-Ranges": "bytes",
        // chunksize
        "Content-Length": chunksize,
        //mime.getType(req.params.filename) 
        "Content-Type": mime.getType(req.params.filename),
      });

      const stream = fs
        .createReadStream(movie, { start: start, end: end, autoClose: true })

        .on("end", function () {
          console.log("Stream Done");
        })

        .on("error", function (err) {
          res.end(err);
        })

        .pipe(res, { end: true });
    });
  };
}
