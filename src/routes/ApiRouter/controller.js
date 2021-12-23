import fs, {access, constants} from 'fs'
import path from 'path'
import mime from 'mime'
import { findSubtitles } from '../../utils/extractSubtitles';
import { findFiles } from '../../utils/fileManipulation';

export default class ApiController {
  stream = async (req, res, next) => {
    const params = req.params;
    const pathMovie = path.resolve("./public/" + req.params.filename);

    // Check if the file exists in the current directory.
    access(pathMovie, constants.F_OK, async (err) => {
      console.log(`${pathMovie} ${err ? 'does not exist' : 'exists'}`);
    });

    fs.stat(pathMovie, async function (err, stats) {
      var range = req.headers.range;
      
      if (!range) {
        return res.sendStatus(416);
      }

      await findSubtitles(pathMovie)
      
      // Chunk logic here
      const positions = range.replace(/bytes=/, "").split("-");
      const start = parseInt(positions[0], 10);
      const total = stats.size;
      const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      const chunksize = end - start + 1;

      res.writeHead(206, {
        "Transfer-Encoding": "chunked",

        "Content-Range": "bytes " + start + "-" + end + "/" + total,

        "Accept-Ranges": "bytes",
        // chunksize
        "Content-Length": chunksize,
        //mime.getType(req.params.filename) 
        "Content-Type": mime.getType(req.params.filename),
      });

       // Streaming video here
      fs
        .createReadStream(pathMovie, { start: start, end: end, autoClose: true })

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
