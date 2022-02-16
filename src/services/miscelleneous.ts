import { opendir, rm } from "fs/promises";
import { appendFile, createReadStream, createWriteStream, readFileSync } from "fs";
import path from "path";
import { basePath } from "../config/defaultConfig";
import { findBaseFolder } from "../utils/fileManipulation";
import TvShowService from "../modules/TvShow/TvShow.service";
import VideoService from "../modules/Video/Video.service";
import { tvShowModel } from "../schemas/TvShow";
import { videoModel } from "../schemas/Video";
import { regExBasename, regexTvShow, regexYearDate } from "../utils/regexes";
import { parseBasename } from "../utils/stringManipulation";
import { ExtSubtitle, ExtVideo, TvShow, Video } from "../types";

export async function go(filepath: string, filename: string, regex: RegExp) {
  try {
    const dir = await opendir(filepath);
    for await (const dirent of dir) {
      if (dirent.isFile()) {
        if (regex.test(dirent.name)) {
          const parsed = path.parse(dir.path + path.sep + dirent.name);
          appendFile(basePath + path.sep + filename, `${JSON.stringify(parsed)}\n`, () => { });
        }
      } else {
        await go(dir.path + "/" + dirent.name, filename, regex);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export async function createEntry(filename: string, type: "video" | "subtitle", baseFolder: string) {
  let tv = 0,
    tct = 0,
    tut = 0,
    tcm = 0;
  const file = readFileSync(filename, "utf-8");
  const lines = file.split("\n");

  for (const line of lines) {
    // To prevent error from last line in file being ""
    if (!line.length) break;

    const parsed = JSON.parse(line);
    const { dir, base, ext } = parsed;
    const name = findBaseFolder(dir, baseFolder);
    let result = <VideoMaker>{};

    if (type === "video") {
      result = await makeVideo(dir, name, base, ext);
    } else {
      //  result = await makeSubtitle(dir, name, base, ext);
    }
    tcm += result.movieJob;
    tv += result.countVideo;
    tct += result.countTvShowCreated;
    tut += result.countUpdatedTvShow;
  }

  return { tv, tct, tut, tcm };
}

type VideoMaker = {
  countVideo: number;
  movieJob: number;
  countTvShowCreated: number;
  countUpdatedTvShow: number;
}
export async function makeVideo(
  location: string, basename: any,
  filename: string, ext: ExtVideo): Promise<VideoMaker> {
  // In case video is in root folder we fall back onto video's name
  // And we clean it
  if (!basename) {
    basename = filename.match(regExBasename);
    basename = basename[1];
  }
  basename = basename.match(regExBasename);
  basename = parseBasename(basename[1]);

  let countVideo = 0,
    movieJob = 0,
    countTvShowCreated = 0,
    countUpdatedTvShow = 0;
  const isTvShow = filename.match(regexTvShow);
  const season = isTvShow && (isTvShow[1] || isTvShow[3] || isTvShow[5]);
  const episode = isTvShow && (isTvShow[2] || isTvShow[4] || isTvShow[6]);
  const name = isTvShow ? `${basename} s${season}e${episode}` : basename;

  // check if already exists
  const existInDb = await videoModel.find({ name });
  if (existInDb.length) return { countVideo, movieJob, countTvShowCreated, countUpdatedTvShow };

  let video = <Video>{};
  const year = filename.match(regexYearDate);
  try {
    video = await VideoService.create(
      {
        filename,
        basename,
        name,
        ext,
        location,
        year: year?.length ? new Date(year[0]) : undefined,
        type: isTvShow ? "tv" : "movie",
        episode: isTvShow ? +episode! : "",
        season: isTvShow ? +season! : "",
      },
      // Only creating for movies
      // if tvshow it's next condition
      { movieJob: isTvShow ? false : true }
    );
  } catch (error) {
    console.error(error);
  }

  countVideo++;

  if (!isTvShow) {
    movieJob++;
  }

  // video = existInDb[0];

  if (!isTvShow) return { countVideo, movieJob, countTvShowCreated, countUpdatedTvShow };

  const re = new RegExp(`${basename}`, "i");
  let tvShow: TvShow | null = await tvShowModel.findOne({ name: re });

  if (!tvShow) {
    tvShow = await TvShowService.create(
      {
        name: basename,
        location,
        seasons: [
          {
            number: +season!,
            episodes: [{ number: +episode!, ref: video._id }],
          },
        ],
      },
      {
        movieJob: true,
        id: video._id,
      }
    );
    countTvShowCreated++;
    movieJob++;
    // TODO: log here which tvShow has been created with name and location
  } else {
    const { seasons } = tvShow;
    const seasonIsPresent = seasons.findIndex(el => {
      return +el.number === +season!;
    });

    if (seasonIsPresent === -1) {
      seasons.push({
        number: +season!,
        episodes: [{ number: +episode!, ref: video._id }],
      });
    } else {
      const modifiedSeason = seasons.splice(seasonIsPresent, 1);
      const episodeIsPresent = modifiedSeason[0].episodes.findIndex(el => +el.number === +episode!);

      if (episodeIsPresent === -1) {
        modifiedSeason[0].episodes.push({
          number: +episode!,
          ref: video._id,
        });
        seasons.push(modifiedSeason[0]);
      }
    }
    tvShow.seasons = seasons;
    // @ts-ignore
    await tvShow.save();
    countUpdatedTvShow++;
    // TODO: log here which tvshow has been update with name and data
  }

  return { countVideo, movieJob, countTvShowCreated, countUpdatedTvShow };
}

export async function makeSubtitle(location: string, basename: string, filename: string, ext: ExtSubtitle) { }
