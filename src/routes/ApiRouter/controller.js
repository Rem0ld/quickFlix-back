import fs, { access, constants } from "fs"
import path from "path"
import mime from "mime"
import { videoModel } from "../../schemas/Video"

export default class ApiController {
  async stream(req, res, next) {
    const { id } = req.params
    if (!id) next(new Error("An id is required"))

    const video = await videoModel.findById(id)

    // Check if the file exists in the current directory.
    access(video.location, constants.F_OK, async err => {
      // TODO: log here with file name and location
      console.log(`${video.name} ${err ? "does not exist" : "exists"}`)
      next(new Error("Cannot access this patch"))
    })

    fs.stat(video.location, async function (err, stats) {
      var range = req.headers.range

      if (!range) {
        return res.sendStatus(416)
      }

      // Chunk logic here
      const positions = range.replace(/bytes=/, "").split("-")
      const start = parseInt(positions[0], 10)
      const total = stats.size
      const end = positions[1] ? parseInt(positions[1], 10) : total - 1
      const chunksize = end - start + 1

      res.writeHead(206, {
        "Transfer-Encoding": "chunked",

        "Content-Range": "bytes " + start + "-" + end + "/" + total,

        "Accept-Ranges": "bytes",
        // chunksize
        "Content-Length": chunksize,
        //mime.getType(req.params.filename)
        "Content-Type": mime.getType(video.ext),
      })

      // Streaming video here
      fs.createReadStream(video.location, { start: start, end: end, autoClose: true })

        .on("end", function () {
          console.log("Stream Done")
        })

        .on("error", function (err) {
          res.end(err)
        })

        .pipe(res, { end: true })
    })
  }
}
