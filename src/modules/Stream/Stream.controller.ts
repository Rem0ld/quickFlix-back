import fs, { access, constants, Stats } from "fs";
import { NextFunction, Request, Response } from 'express'
import { Controller, Middleware, ErrorMiddleware, Get, Post, Put, Delete } from "@overnightjs/core"
import path from "path";
import mime from "mime";
import { videoModel } from "../../schemas/Video";
import errorHandler from "../../services/errorHandler";
import { Video } from "../../types";
import { logger } from "../../libs/logger";

@Controller("stream")
export default class StreamController {
  @Get(":id")
  @ErrorMiddleware(errorHandler)
  private async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    if (!id) next(new Error("An id is required"));

    const video: Video | null = await videoModel.findById(id);

    if (!video) {
      next(new Error("This id doesn't exist"))
      return;
    }

    // Check if the file exists in the current directory.
    access(video.location, constants.F_OK, async err => {
      logger.info(`${video.name} ${err ? "does not exist" : "exists"}`)
      logger.info(`located: ${video.location}`)
      if (err) {
        next(err)
        return;
      }
    });

    // Making path here as location only contains the location without the filename
    const videoPath = video.location + path.sep + video.filename;

    fs.stat(videoPath, async function (_, stats: Stats) {
      const range = req.headers.range;

      if (!range) {
        return res.sendStatus(416);
      }

      // Chunk logic here
      const positions = range.replace(/bytes=/, "").split("-");
      const start = parseInt(positions[0], 10);
      const total = stats.size;
      const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      const chunksize = end - start + 1;
      const type: string = mime.getType(video.ext) as string;

      res.writeHead(206, {
        "Transfer-Encoding": "chunked",

        "Content-Range": "bytes " + start + "-" + end + "/" + total,

        "Accept-Ranges": "bytes",
        // chunksize
        "Content-Length": chunksize,
        //mime.getType(req.params.filename)
        "Content-Type": type,
      });

      // Streaming video here
      fs.createReadStream(videoPath, { start: start, end: end, autoClose: true })

        .on("end", function () {
          console.log("Stream Done");
        })

        .on("error", function (err) {
          res.end(err);
        })

        .pipe(res, { end: true });
    });
  }
}