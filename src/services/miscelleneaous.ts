import { opendir, readFile, rm } from "fs/promises";
import { appendFile, opendirSync, readSync } from "fs";
import path from "path";
import { findBaseFolder } from "../utils/fileManipulation";
import TvShowService from "../modules/TvShow/TvShow.service";
import VideoService from "../modules/Video/Video.service";
import { regExBasename, regexTvShow, regexYearDate } from "../utils/regexes";
import { parseBasename } from "../utils/stringManipulation";
import { ExtSubtitle, ExtVideo, TTvShow, TVideo } from "../types";
import { logger } from "../libs/logger";

/**
 * Creates a file that references all wanted (regex) files (absolute path) from a directory - use recursion to follow all subfolder
 * @param {String} root Directory to be searched
 * @param {String} filename name of the file created
 * @param {RegExp} regex Type of file we want
 */
export async function go(
  root: string,
  tempFileName: string,
  regex: RegExp,
  list: any
): Promise<any> {
  try {
    const dir = opendirSync(root);
    let dirent;
    while ((dirent = dir.readSync()) !== null) {
      if (dirent.isFile()) {
        if (regex.test(dirent.name)) {
          const parsed = path.parse(dir.path + path.sep + dirent.name);
          appendFile(tempFileName, `${JSON.stringify(parsed)}\n`, () => { });
          list.push(parsed)
        }
      } else {
        await go(dir.path + "/" + dirent.name, tempFileName, regex, list);
      }
    }
    await dir.close()
    return list
  } catch (err) {
    console.error(err);
  }
}

/**
 * Creates entry from a file (created from the "go" function)
 * @param {String} filename
 * @param {"video" | "subtitle"} type
 * @param {String} baseFolder
 * @returns count of created video, tv show
 */
// export async function createEntry(
//   filename: string,
//   type: "video" | "subtitle",
//   baseFolder: string
// ) {
//   const file = await readFile(filename, "utf-8");
//   const lines = file.split("\n");

//   for (const line of lines) {
//     // To prevent error from last line in file being ""
//     if (!line.length) break;

//     const parsed = JSON.parse(line);
//     const { dir, base, ext } = parsed;
//     const name = findBaseFolder(dir, baseFolder);
//     let result = {};

//     if (type === "video") {
//       result = await makeVideo(dir, name, base, ext);
//     } else {
//       //  result = await makeSubtitle(dir, name, base, ext);
//     }
//   }

//   return {};
// }

// export async function makeVideo(
//   location: string,
//   basename: any,
//   filename: string,
//   ext: ExtVideo
// ){
//   // In case video is in root folder we fall back onto video's name
//   // And we clean it
//   if (!basename) {
//     basename = filename.match(regExBasename);
//     basename = basename[1];
//   }
//   basename = basename.match(regExBasename);
//   basename = parseBasename(basename[1]);

//   let countVideo = 0,
//     movieJob = 0,
//     countTvShowCreated = 0,
//     countUpdatedTvShow = 0;
//   const isTvShow = filename.match(regexTvShow);
//   const season = isTvShow && (isTvShow[1] || isTvShow[3] || isTvShow[5]);
//   const episode = isTvShow && (isTvShow[2] || isTvShow[4] || isTvShow[6]);
//   const name = isTvShow ? `${basename} s${season}e${episode}` : basename;

//   // check if already exists
//   const existInDb = await VideoService.find({ name });
//   if (existInDb.length)
//     return { countVideo, movieJob, countTvShowCreated, countUpdatedTvShow };

//   let video = <TVideo>{};
//   const year = filename.match(regexYearDate);
//   try {
//     video = await VideoService.create(
//       {
//         filename,
//         basename,
//         name,
//         ext,
//         location,
//         year: year?.length ? new Date(year[0]) : undefined,
//         type: isTvShow ? "tv" : "movie",
//         episode: isTvShow ? +episode! : "",
//         season: isTvShow ? +season! : "",
//       },
//       // Only creating for movies
//       // if tvshow it's next condition
//       { movieJob: isTvShow ? false : true }
//     );
//   } catch (error) {
//     console.error(error);
//   }

//   countVideo++;

//   if (!isTvShow) {
//     movieJob++;
//   }

//   // video = existInDb[0];

//   if (!isTvShow)
//     return { countVideo, movieJob, countTvShowCreated, countUpdatedTvShow };

//   let tvShow: TTvShow | null = await TvShowService.findByName({
//     name: basename,
//   });

//   if (!tvShow) {
//     tvShow = await TvShowService.create(
//       {
//         name: basename,
//         location,
//         seasons: [
//           {
//             number: +season!,
//             episodes: [{ number: +episode!, ref: video.id }],
//           },
//         ],
//       },
//       {
//         movieJob: true,
//         id: video.id,
//       }
//     );
//     countTvShowCreated++;
//     movieJob++;
//     logger.info(`Created tvShow ${tvShow.name} ${tvShow.location}`);
//   } else {
//     const { seasons } = tvShow;
//     const seasonIsPresent = seasons.findIndex(el => {
//       return +el.number === +season!;
//     });

//     if (seasonIsPresent === -1) {
//       seasons.push({
//         number: +season!,
//         episodes: [{ number: +episode!, ref: video.id }],
//       });
//     } else {
//       const modifiedSeason = seasons.splice(seasonIsPresent, 1);
//       const episodeIsPresent = modifiedSeason[0].episodes.findIndex(
//         el => +el.number === +episode!
//       );

//       if (episodeIsPresent === -1) {
//         modifiedSeason[0].episodes.push({
//           number: +episode!,
//           ref: video.id,
//         });
//         seasons.push(modifiedSeason[0]);
//       }
//     }
//     tvShow.seasons = seasons;
//     // @ts-ignore
//     await tvShow.save();
//     countUpdatedTvShow++;
//     logger.info(`${tvShow.name} updated`);
//   }

//   return { countVideo, movieJob, countTvShowCreated, countUpdatedTvShow };
// }

// export async function makeSubtitle(
//   location: string,
//   basename: string,
//   filename: string,
//   ext: ExtSubtitle
// ) { }
