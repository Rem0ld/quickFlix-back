import path from "path";
import dotenv from "dotenv";
import srt2vtt from "srt-to-vtt";
import fetch from "node-fetch";
import { appendFile, createReadStream, createWriteStream, readFileSync } from "fs";
import { videoModel } from "../../schemas/Video";
import { tvShowModel } from "../../schemas/TvShow";
import { findFiles } from "../../utils/fileManipulation";
import { subtitleModel } from "../../schemas/Subtitles";
import {
  regexIsSubtitle,
  regExBasename,
  regexTvShow,
  regexYearDate,
  regexVideo,
} from "../../utils/regexes";
import { parseBasename } from "../../utils/stringManipulation";
import VideoService from "../VideosRouter/service";
import { findSubtitles } from "../../utils/extractSubtitles";
import MovieDbJobsService from "../MovieDbJobRouter/service";
import TvShowService from "../TvShowRouter/service";
import { basePath, movieDbUrl } from "../../config/defaultConfig";
import { getImages, getGenres, getTvShowDetails, getVideoPath } from "../../services/apiService";
import { opendir, rm } from "fs/promises";

dotenv.config();

const excludedExtension = [
  "DS_Store",
  "nfo",
  "txt",
  "html",
  "7z",
  "zip",
  "doc",
  "db",
  "jpg",
  "jpeg",
  "png",
  "completed",
  "url",
];

async function go(filepath, filename, regex) {
  try {
    const dir = await opendir(filepath);
    for await (const dirent of dir) {
      if (dirent.isFile()) {
        if (regex.test(dirent.name)) {
          const parsed = path.parse(dir.path + path.sep + dirent.name);
          appendFile(basePath + path.sep + filename, `${JSON.stringify(parsed)}\n`, () => {});
        }
      } else {
        await go(dir.path + "/" + dirent.name, filename, regex);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function createEntry(filename, type, baseFolder) {
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
    let result;
    if (type === "video") {
      result = await makeVideo(dir, name, base, ext);
    } else {
      result = await makeSubtitle(name, base, ext);
    }
    tcm += result.movieJob;
    tv += result.countVideo;
    tct += result.countTvShowCreated;
    tut += result.countUpdatedTvShow;
  }

  return { tv, tct, tut, tcm };
}

async function makeVideo(location, basename, filename, ext) {
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

  let video;
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
        episode: isTvShow ? +episode : "",
        season: isTvShow ? +season : "",
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
  let tvShow = await tvShowModel.findOne({ name: re });

  if (!tvShow) {
    tvShow = await TvShowService.create(
      {
        name: basename,
        location,
        seasons: [
          {
            number: +season,
            episodes: [{ number: +episode, ref: video._id }],
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
      return +el.number === +season;
    });

    if (seasonIsPresent === -1) {
      seasons.push({
        number: +season,
        episodes: [{ number: +episode, ref: video._id }],
      });
    } else {
      const modifiedSeason = seasons.splice(seasonIsPresent, 1);
      const episodeIsPresent = modifiedSeason[0].episodes.findIndex(el => +el.number === +episode);

      if (episodeIsPresent === -1) {
        modifiedSeason[0].episodes.push({
          number: +episode,
          ref: video._id,
        });
        seasons.push(modifiedSeason[0]);
      }
    }
    tvShow.seasons = seasons;
    await tvShow.save();
    countUpdatedTvShow++;
    // TODO: log here which tvshow has been update with name and data
  }

  return { countVideo, movieJob, countTvShowCreated, countUpdatedTvShow };
}

async function makeSubtitle(location, basename, filename, ext) {}

function findBaseFolder(filepath, folderName) {
  if (!folderName || !filepath) return -1;
  const splited = filepath.split(path.sep);
  const position = splited.indexOf(folderName);
  return splited[position + 1];
}
export default class DiscoverController {
  async discover(_, res) {
    const videosPath = basePath + path.sep + "videos";
    const tempFile = basePath + path.sep + "video";

    await go(videosPath, "video", regexVideo);
    // await go(p, "subtitle", regexIsSubtitle);

    const result = await createEntry(tempFile, "video", "videos");
    await rm(tempFile);

    res.json(result);
  }

  async discoverSubtitles(_, res) {
    let countSubtitleCreated = 0;
    const subDirectories = [];
    const files = await findFiles(basePath);

    const goThrough = async (files, extraPath = "") => {
      for (const file of files) {
        const ext = path.extname(file.name);
        const isSubtitle = regexIsSubtitle.test(ext);

        const exclude = excludedExtension.some(ext => file.name.includes(ext));

        if (exclude) continue;

        if (file.isDirectory() || file.isSymbolicLink()) {
          const sub = await findFiles(basePath + "/" + extraPath + "/" + file.name);
          subDirectories.push({
            directory: extraPath + "/" + file.name,
            content: sub.filter(el => !el.name.includes("DS_Store")),
          });
          continue;
        }

        // Here we need to work the file
        const filename = path.basename(file.name, ext);
        const absolutePath = path.resolve(basePath + "/" + extraPath + "/");
        let basename = filename.match(regExBasename);

        basename = parseBasename(basename[1]);

        const isTvShow = filename.match(regexTvShow);
        const season = isTvShow && (isTvShow[1] || isTvShow[3]);
        const episode = isTvShow && (isTvShow[2] || isTvShow[4]);

        if (isSubtitle) {
          const subExists = await subtitleModel.find({ name: filename });
          if (subExists.length > 0) continue;

          if (ext.includes("srt")) {
            createReadStream(absolutePath + "/" + file.name)
              .pipe(srt2vtt())
              .pipe(createWriteStream(`${absolutePath}/${filename}.vtt`));
          }

          const data = await subtitleModel.create({
            ext: ".vtt",
            path: absolutePath,
            name: filename,
          });

          let video;

          if (isTvShow) {
            video = await VideoService.findByFields({
              name: basename,
              episode: +episode,
              season: +season,
            });
          } else {
            video = await VideoService.findByFields({
              name: basename,
            });

            if (video.length) {
              video[0].subtitles.push(data._id);
              await video[0].save();
            }
          }

          countSubtitleCreated++;
          continue;
        } else {
          // It's a video let's look into container for text streams

          const result = await findSubtitles(
            absolutePath + "/" + file.name,
            basename,
            isTvShow,
            season,
            episode
          );
          // console.log(result);
        }
      }

      while (subDirectories.length > 0) {
        const subDirectory = subDirectories.shift();
        await goThrough(subDirectory.content, subDirectory.directory);
      }
    };
    await goThrough(files);

    res.json({
      countSubtitleCreated,
    });
  }

  /**
   * We need to do 2 calls: Movies and Tvshows, we have distinction in movieJob
   * For Movies:
   * first we call on multi -> [0]
   *    we get id, overview, poster_path, release_date, vote_average, poster_path
   * then we call on  `https://api.themoviedb.org/3/movie/${movieId}${apiKey}`
   *    we get genres...
   * then we call on `https://api.themoviedb.org/3/movie/${movieId}/videos${apiKey}
   *    we get youtube key teaser (5 first)
   *
   * For TvShows:
   * first we call on multi -> [0]
   *    we get id, overview, poster_path, first_air_date, vote_average, origin_country
   * then we call on `https://api.themoviedb.org/3/tv/${movieId}${apiKey}`
   *    we get genres, number_of_episodes, number_of_seasons, in_production
   * then we call on `https://api.themoviedb.org/3/tv/${movieId}/videos${apiKey}`
   *
   */
  async discoverDetails(_, res) {
    let count = 0,
      errorCount = 0;

    // Movies
    const movieJobs = await MovieDbJobsService.findActive({ type: "movie" });

    for (const job of movieJobs) {
      const video = await videoModel.findById(job.video);
      const yearMovie = new Date(video.year).getFullYear();
      let status = "done";

      // API Call
      const response = await fetch(movieDbUrl + video.basename);
      console.log(
        "🚀 ~ file: controller.js ~ line 356 ~ DiscoverController ~ discoverDetails ~ movieDbUrl + video.basename",
        movieDbUrl + video.basename
      );
      const { results } = await response.json();

      if (!results.length) {
        console.log(`No result for ${video.basename}`);
        continue;
      }

      let result;

      // In case of several movie with the same name we look for the release date
      // not bullet proof but will do the job
      if (yearMovie) {
        for (const el of results) {
          const yearResult = new Date(el.release_date).getFullYear();

          if (yearMovie === yearResult) {
            result = el;
            break;
          }
        }

        // In the case dates are not correct
        // See Bac Nord - 2020 on file, 2021 on themoviedb
        if (!result) {
          result = results[0];
        }
      } else {
        result = results[0];
      }

      // Checking if image already exists or it will be downloaded
      const image = await getImages(result?.poster_path);

      if (image) {
        video.posterPath.push(image);
      }

      // Making the new video object
      video.idMovieDb = result.id;
      video.resume = result.overview;
      video.releaseDate = result.release_date;
      video.score = result.vote_average;
      video.genres = await getGenres(result.id, "movie");
      video.trailerYtCode = await getVideoPath(result.id, "movie");

      try {
        await video.save();
      } catch (error) {
        console.error("not saved", error);
        status = "error";
        job.error.push(error);
        errorCount++;
      }

      MovieDbJobsService.update(job._id, { status, error: job.error });
      count++;
      await new Promise(r => setTimeout(r, 2000));
    }

    // TvShows
    const tvJobs = await MovieDbJobsService.findActive({ type: "tv" });

    for (const job of tvJobs) {
      const tvShow = await TvShowService.findByName(job.video.basename);
      let status = "done";

      const response = await fetch(movieDbUrl + tvShow.name);
      const { results } = await response.json();

      if (!results.length) {
        console.error(`No result for ${tvShow}`);
        continue;
      }

      let result = results[0];

      // Check image
      const image = await getImages(result.poster_path);

      if (image) {
        tvShow.posterPath.push(image);
      }

      tvShow.idMovieDb = result.id;
      tvShow.resume = result.overview;
      tvShow.score = result.vote_average;
      tvShow.firstAirDate = result.first_air_date;
      tvShow.trailerYtCode = await getVideoPath(result.id, "tv");

      const { genres, ongoing, originCountry, numberEpisode, numberSeason } =
        await getTvShowDetails(result.id);

      tvShow.genres = genres || [];
      tvShow.ongoing = ongoing || undefined;
      tvShow.originCountry = originCountry || [];
      tvShow.numberSeason = numberSeason || undefined;
      tvShow.numberEpisode = numberEpisode || undefined;

      try {
        await tvShow.save();
      } catch (error) {
        console.error("not saved", error);
        status = "error";
        job.error.push(error);
        errorCount++;
      }

      MovieDbJobsService.update(job._id, { status, error: job.error });
      count++;
      await new Promise(r => setTimeout(r, 2000));
    }

    res.json({
      errorCount,
      count,
    });
  }

  async discoverTest(_, res) {
    const videosPath = basePath + path.sep + "videos";
    const tempFile = basePath + path.sep + "video";

    await go(videosPath, "video", regexVideo);
    // await go(p, "subtitle", regexIsSubtitle);

    const result = await createEntry(tempFile, "video", "videos");
    await rm(tempFile);

    res.json(result);
  }
}
