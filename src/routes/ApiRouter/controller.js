import fs, {access, constants} from 'fs'
import path from 'path'
import mime from 'mime'

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
      
      //Chunk logic here
      var positions = range.replace(/bytes=/, "").split("-");
      var start = parseInt(positions[0], 10);
      var total = stats.size;
      var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      var chunksize = end - start + 1;
      console.log(mime.getType(req.params.filename))
      res.writeHead(206, {
        "Transfer-Encoding": "chunked",

        "Content-Range": "bytes " + start + "-" + end + "/" + total,

        "Accept-Ranges": "bytes",

        "Content-Length": chunksize,

        "Content-Type": 'video/mp4',
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
