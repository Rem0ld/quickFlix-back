
import ffmpeg from 'fluent-ffmpeg'
import { subtitleExists } from './fileManipulation';
import path from 'path'

export function extractSubtitleTrack(inputFile, streamInfo, outputFile) {
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
      console.log(e, e.code, e.msg);
  }
}

export function findSubtitles(movie) {
  // Finding subtitles
  ffmpeg.ffprobe(movie, async (err, metadata) => {
    const title = metadata.format.tags.title
    const languages = {}

    for await (const stream of metadata.streams) {
      if(stream.codec_name.includes('subrip') ) {
        const language = stream.tags.language
        let outputFile = ''
  
        // Keeping track of how many subtitles we have for one language
        if(languages[language] > 0) {
          languages[language] += 1
        }else {
          languages[language] = 1
        }
        
        outputFile = `${title}.${languages[language]}.${language}`

        const exists = await subtitleExists(outputFile)
        console.log( {exists})

        if(exists !== undefined) {
          console.log('in condition', {exists})
          extractSubtitleTrack(movie, stream, outputFile + '.vtt');
        }
      }
    }
    
    // metadata.streams.forEach(async (element) => {
    //   if(element.codec_name.includes('subrip') ) {
    //     const language = element.tags.language
    //     let outputFile = ''
  
    //     // Keeping track of how many subtitles we have for one language
    //     if(languages[language] > 0) {
    //       languages[language] += 1
    //     }else {
    //       languages[language] = 1
    //     }
        
    //     outputFile = `${title}.${languages[language]}.${language}`

    //     const exists = await subtitleExists(outputFile)

    //     if(exists !== undefined) {
    //       console.log('in condition', {exists})
    //       extractSubtitleTrack(movie, element, outputFile + '.vtt');
    //     }
    //   }
    // });
  })
}

