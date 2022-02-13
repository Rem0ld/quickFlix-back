import path from "path";
import dotenv from "dotenv";
import srt2vtt from "srt-to-vtt";
import fetch from "node-fetch";
import { accessSync, createReadStream, createWriteStream, rm } from "fs";
import { videoModel } from "../../schemas/Video";
import { tvShowModel } from "../../schemas/TvShow";
import { downloadImage, fileExists, findFiles } from "../../utils/fileManipulation";
import { subtitleModel } from "../../schemas/Subtitles";
import { regexIsSubtitle, regExBasename, regexTvShow, regexYearDate } from "../../utils/regexes";
import { parseBasename } from "../../utils/stringManipulation";
import VideoService from "../VideosRouter/service";
import { findSubtitles } from "../../utils/extractSubtitles";
import MovieDbJobsService from "../MovieDbJobRouter/service";
import TvShowService from "../TvShowRouter/service";

dotenv.config();

const movieDbUrl = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.API_MOVIEDB}&page=1&include_adult=false&language=en-US&query=`;
const imageDbUrl = `https://image.tmdb.org/t/p/w500`;

// Need to add id after tv/ then add the remaining of the URL
const detailDbUrl = `https://api.themoviedb.org/3`; // tv | movie / {id}
const apikeyUrl = `?api_key=${process.env.API_MOVIEDB}&language=en-US`;

const basePath = path.resolve("./public/");
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

export default class DiscoverController {
  async discover(_, res) {
    console.log("Starts discovering");
    let countCreatedVideo = 0,
      countCreatedTvShow = 0,
      countUpdatedTvShow = 0,
      countCreatedMovieJob = 0;
    const subDirectories = [];
    const files = await findFiles(basePath);

    const goThrough = async (files, extraPath = "") => {
      for (const file of files) {
        const ext = path.extname(file.name);

        const exclude = excludedExtension.some(ext => file.name.includes(ext));

        if (exclude) continue;

        if (file.isDirectory() || file.isSymbolicLink()) {
          //          console.log({file}, 'is directory')
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

        if (!regexIsSubtitle.test(ext)) {
          const parentFolder = extraPath.split(path.sep);
          const currentFolder = parentFolder[parentFolder.length - 1];
          const lowerCurrentFile = currentFolder.toLowerCase();
          const isRoot = lowerCurrentFile.includes("videos") || lowerCurrentFile.includes("series");
          let basename = "";

          if (isRoot) {
            basename = filename.match(regExBasename);
          } else {
            // Saison || Season folder name
            const isMissNamed =
              lowerCurrentFile.includes("season") || lowerCurrentFile.includes("saison");

            if (isMissNamed) {
              basename = parentFolder[parentFolder.length - 2].match(regExBasename);
            } else {
              basename = currentFolder.match(regExBasename);
            }
          }

          console.log(basename);

          if (!basename) {
            console.error("Something wrong has happened");
            // TODO: log here with filename
            console.error(filename);
          }

          basename = parseBasename(basename[1]);

          const isTvShow = filename.match(regexTvShow);
          const season = isTvShow && (isTvShow[1] || isTvShow[3] || isTvShow[5]);
          const episode = isTvShow && (isTvShow[2] || isTvShow[4] || isTvShow[6]);
          const name = isTvShow ? `${basename} s${season}e${episode}` : basename;

          // if (basename.includes("thrones")) {
          //   console.log(isTvShow);
          // }

          // check if already exists
          const existInDb = await videoModel.find({ name });
          console.log(existInDb);
          let video;
          if (!existInDb.length) {
            const location = path.resolve(absolutePath + "/" + file.name);
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
              console.log({
                filename,
                basename,
                name,
                ext,
                location,
                type: isTvShow ? "tv" : "movie",
                episode: isTvShow ? +episode : "",
                season: isTvShow ? +season : "",
              });
              console.error(error);
            }

            countCreatedVideo++;

            if (!isTvShow) {
              countCreatedMovieJob++;
            }
            // TODO: log here which video has been created with name and location
          } else {
            video = existInDb[0];
          }

          if (isTvShow) {
            const re = new RegExp(`${basename}`, "i");
            let tvShow = await tvShowModel.findOne({ name: re });
            console.log(tvShow);

            // To get root Tv Show folder it should always be parentFolder[2]
            const location = `${basePath}/${parentFolder[1]}/${
              parentFolder[2] ? parentFolder[2] : ""
            }`;

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
              countCreatedTvShow++;
              countCreatedMovieJob++;
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
                tvShow.seasons = seasons;
                await tvShow.save();
                countUpdatedTvShow++;
                continue;
              } else {
                const modifiedSeason = seasons.splice(seasonIsPresent, 1);
                const episodeIsPresent = modifiedSeason[0].episodes.findIndex(
                  el => +el.number === +episode
                );

                if (episodeIsPresent === -1) {
                  modifiedSeason[0].episodes.push({
                    number: +episode,
                    ref: video._id,
                  });
                  seasons.push(modifiedSeason[0]);
                  tvShow.seasons = seasons;
                  await tvShow.save();

                  countUpdatedTvShow++;
                  continue;
                }
              }
              // TODO: log here which tvshow has been update with name and data
            }
          }
        }
      }

      while (subDirectories.length > 0) {
        const subDirectory = subDirectories.shift();
        console.log("============");
        console.log(subDirectory);
        console.log("============");
        await goThrough(subDirectory.content, subDirectory.directory);
      }
    };
    await goThrough(files);

    console.log("Ends discovering");
    res.json({
      countCreatedVideo,
      countCreatedTvShow,
      countUpdatedTvShow,
      countCreatedMovieJob,
    });
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
        // See Bac Nord 2020 on file 2021 on themoviedb
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

      console.log(result);
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
}

/**
 * Fetch details for a tvShow
 * @param {String} id TheMovieDb id
 * @returns Object {genres, ongoing, numberSeason, numberEpisode, originCountry}
 */
export async function getTvShowDetails(id) {
  try {
    const response = await fetch(`${detailDbUrl}/tv/${id}${apikeyUrl}`);
    const result = await response.json();
    if (!result) return {};

    return {
      genres: result.genres.map(el => el.name),
      ongoing: result.in_production,
      numberSeason: result.number_of_seasons,
      numberEpisode: result.number_of_episodes,
      originCountry: result.origin_country,
    };
  } catch (error) {
    return {};
  }
}

/**
 * Fetch genres for a movie
 * @param {String} id of the video on TheMovieDBApi
 * @returns genres of the video
 */
export async function getGenres(id) {
  try {
    const response = await fetch(`${detailDbUrl}/movie/${id}${apikeyUrl}`);
    const result = await response.json();
    if (!result) return [];

    return result.genres.map(genre => genre.name);
  } catch (error) {
    return [];
  }
}

/**
 * Fetch trailers and teasers youtube key for a video
 * @param {String} id of the video on theMovieDBApi
 * @param {String} type enum tv | movie
 * @returns String[] of youtube key
 */
export async function getVideoPath(id, type) {
  try {
    const response = await fetch(`${detailDbUrl}/${type}/${id}/videos${apikeyUrl}`);
    const { results } = await response.json();
    if (!results) return [];

    let result = [],
      i = 0;

    while (i < results.length && result.length < 5) {
      if (results[i].type.includes("Teaser") || results[i].type.includes("Trailer")) {
        result.push(results[i].key);
      }
      i++;
    }

    return result;
  } catch (error) {
    return [];
  }
}

/**
 * Check if an image already exists
 * Download the image if doesn't exists
 * @param {String} filepath name of the file + extension
 * @returns the path of the image or undefined
 */
export async function getImages(filepath) {
  if (!filepath) return -1;
  const basePath = path.resolve("./public/images");
  const imagePath = `${basePath}${filepath}`;

  if (!fileExists(imagePath)) {
    const image = await downloadImage(imageDbUrl + filepath, imagePath);
    return image;
  }

  return undefined;
}
