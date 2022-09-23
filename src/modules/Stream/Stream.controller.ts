import fs, { Stats } from "fs";
import { NextFunction, Request, Response } from "express";
import {
  ClassMiddleware,
  Controller,
  ErrorMiddleware,
  Get,
} from "@overnightjs/core";
import path from "path";
import mime from "mime";
import errorHandler from "../../services/errorHandler";
import StreamService from "./Stream.service";
import protectRoutes from "../../middlewares/protectRoutes.middleware";
import { UserDTO } from "../User/User.dto";

@Controller("stream")
@ClassMiddleware([protectRoutes])
export default class StreamController {
  constructor(private service: StreamService) {}

  @Get(":id")
  @ErrorMiddleware(errorHandler)
  private async get(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const { user } = req.query;

    const [video, error] = await this.service.findVideo(id, user as string);
    if (error) {
      next(error);
      return;
    }
    const videoPath = video.location + path.sep + video.filename + video.ext;

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

        .on("end", function () {})

        .on("error", function (err) {
          next(err);
        })

        .pipe(res, { end: true });
    });
  }
}
