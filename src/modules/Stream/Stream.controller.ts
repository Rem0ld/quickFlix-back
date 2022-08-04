import fs, { access, constants, Stats } from "fs";
import { NextFunction, Request, Response } from "express";
import {
  Controller,
  Middleware,
  ErrorMiddleware,
  Get,
  Post,
  Put,
  Delete,
} from "@overnightjs/core";
import path from "path";
import mime from "mime";
import errorHandler from "../../services/errorHandler";
import { TVideo } from "../../types";
import VideoService from "../Video/Video.service";
import StreamService from "./Stream.service";

@Controller("stream")
export default class StreamController {
  constructor(private service: StreamService) { }

  @Get(":id")
  @ErrorMiddleware(errorHandler)
  private async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    const [video, error] = await this.service.findVideo(id);
    if (error) {
      next(error);
    }
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
      fs.createReadStream(videoPath, {
        start: start,
        end: end,
        autoClose: true,
      })

        .on("end", function () { })

        .on("error", function (err) {
          next(err);
        })

        .pipe(res, { end: true });
    });
  }
}
