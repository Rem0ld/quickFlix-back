import path from "path";
import dotenv from "dotenv";
import srt2vtt from "srt-to-vtt";
import fetch from "node-fetch";
import { createReadStream, createWriteStream, rm } from "fs";
import { videoModel } from "../../schemas/Video";
import { tvShowModel } from "../../schemas/TvShow";
import { findFiles } from "../../utils/fileManipulation";
import { subtitleModel } from "../../schemas/Subtitles";
import { regexIsSubtitle, regExBasename, regexTvShow } from "../../utils/regexes";
import { parseBasename } from "../../utils/stringManipulation";
import VideoService from "../VideosRouter/service";
import { findSubtitles } from "../../utils/extractSubtitles";

dotenv.config();

const movieDbUrl = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.API_MOVIEDB}&page=1&include_adult=false&language=en-US&query=`;
const imageDbUrl = `https://image.tmdb.org/t/p/w500`;

// Need to add id after tv/ then add the remaining of the URL
const detailDbUrl = `https://api.themoviedb.org/3/`; // tv | movie / {id}
const apikeyTvShowUrl = `?api_key=${process.env.API_MOVIEDB}&language=en-US`;

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
];

export default class DiscoverController {
  async discover(_, res) {
    console.log("Starts discovering");
    let countCreatedVideo = 0,
      countCreatedTvShow = 0,
      countUpdatedTvShow = 0;
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
          const currentFile = parentFolder[parentFolder.length - 1];
          const isRoot =
            currentFile === "Vidéos" || currentFile === "Series" || currentFile.includes("Saison");
          let basename = "";

          if (isRoot) {
            basename = filename.match(regExBasename);
          } else {
            basename = currentFile.match(regExBasename);
          }

          if (!basename) {
            console.error("Something wrong has happened");
            // TODO: log here with filename
            console.error(filename);
          }

          basename = parseBasename(basename[1]);

          const isTvShow = filename.match(regexTvShow);
          const season = isTvShow && (isTvShow[1] || isTvShow[3]);
          const episode = isTvShow && (isTvShow[2] || isTvShow[4]);
          const name = isTvShow ? `${basename} s${season}e${episode}` : basename;

          // check if already exists
          const existInDb = await videoModel.find({ name });
          let video;
          if (!existInDb.length) {
            const location = path.resolve(absolutePath + "/" + file.name);
            try {
              video = await VideoService.create(
                {
                  filename,
                  basename,
                  name,
                  ext,
                  location,
                  type: isTvShow ? "tv" : "movie",
                  episode: isTvShow ? +episode : "",
                  season: isTvShow ? +season : "",
                },
                { movieJob: true }
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
            // TODO: log here which video has been created with name and location
          } else {
            video = existInDb[0];
          }

          if (isTvShow) {
            let tvShow = await tvShowModel.findOne({ name: basename });

            if (!tvShow) {
              tvShow = await tvShowModel.create({
                name: basename,
                seasons: [
                  {
                    number: +season,
                    episodes: [{ number: +episode, ref: video._id }],
                  },
                ],
              });
              countCreatedTvShow++;
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
        await goThrough(subDirectory.content, subDirectory.directory);
      }
    };
    await goThrough(files);

    console.log("Ends discovering");
    res.json({
      countCreatedVideo,
      countCreatedTvShow,
      countUpdatedTvShow,
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

  discoverDetails() {
    /**
     * To get info on TvShow or movies I need to first look on base movideDbUrl to get the id,
     * then we can do a more specific search on tvShowDbUrl to get seasons, episodes etc
     * we can also get trailer with:
     * https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.API_MOVIEDB}&language=en-US
     * Shape of the results :
     * {
     *  "id": 60574,
     *  "results": [
     *    {
     *      "iso_639_1": "en",
     *      "iso_3166_1": "US",
     *      "name": "Nick Cave And The Bad Seeds - Red Right Hand (Peaky Blinders OST)",
     *      "key": "KGD2N5hJ2e0", WE WANT THIS
     *      "site": "YouTube", AND THIS
     *      "size": 1080,
     *      "type": "Featurette",
     *      "official": false,
     *      "published_at": "2013-10-01T17:24:31.000Z",
     *      "id": "610684c8a76ac500735d39b1"
     *    },
     *  }
     */
  }
}
