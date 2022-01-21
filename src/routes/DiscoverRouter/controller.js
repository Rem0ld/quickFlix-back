import path from "path";
import { findFiles } from "../../utils/fileManipulation";
import { videoModel } from "../../schemas/Video";
import srt2vtt from "srt-to-vtt";
import { createReadStream, createWriteStream, rm } from "fs";
import { subtitleModel } from "../../schemas/Subtitles";
import { tvShowModel } from "../../schemas/TvShow";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const matchExt = /(\w+)$/i;
const matchLng = /(\w+).\w+$/;
const regexTvShow = /(s\d{1,2})(e\d{1,2})/i;
const regExBasename = /([ .\w']+?)($|mp3|[s|S]\d{1,}|\(.*\)|[A-Z]{2,}|\W\d{4}\W?.*)/;
const regexIsSubtitle = /(vtt|srt|sfv)/i;
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
    console.log("Starting discovering");
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
          // It's a video we need to check if already exists in db first
          let basename = filename.match(regExBasename);

          if (!basename) {
            console.error("Something wrong has happened");
            // TODO: log here with filename
            console.error(filename);
          }

          basename = basename[1].replaceAll(".", " ").trim().toLowerCase();

          const isTvShow = filename.match(regexTvShow);
          const season = isTvShow && isTvShow[1].toLowerCase();
          const episode = isTvShow && isTvShow[2].toLowerCase();
          const name = isTvShow ? `${basename} ${season}${episode}` : basename;

          // check if already exists
          const existInDb = await videoModel.find({ name });
          let video;
          if (!existInDb.length) {
            const location = path.resolve(absolutePath + "/" + file.name);
            video = await videoModel.create({
              filename,
              basename,
              name,
              ext,
              location,
              type: isTvShow ? "tv" : "movie",
            });

            countCreatedVideo++;
            console.log("{video} created");
            // TODO: log here which video has been created with name and location
          } else {
            video = existInDb[0];
          }

          if (isTvShow) {
            const seasonNumber = season.match(/(\d+)/)[0];
            const episodeNumber = episode.match(/(\d+)/)[0];
            let tvShow = await tvShowModel.findOne({ name: basename });

            if (!tvShow) {
              tvShow = await tvShowModel.create({
                name: basename,
                seasons: [
                  {
                    number: seasonNumber,
                    episodes: [{ number: episodeNumber, ref: video._id }],
                  },
                ],
              });
              console.log("tvshow created");
              countCreatedTvShow++;
              // TODO: log here which tvShow has been created with name and location
            } else {
              const { seasons } = tvShow;
              const seasonIsPresent = seasons.findIndex(el => {
                return +el.number === +seasonNumber;
              });

              if (seasonIsPresent === -1) {
                seasons.push({
                  number: seasonNumber,
                  episodes: [{ number: episodeNumber, ref: video._id }],
                });
                tvShow.seasons = seasons;
                await tvShow.save();
                console.log("tvshow updated - new season");
                countUpdatedTvShow++;
                continue;
              } else {
                const modifiedSeason = seasons.splice(seasonIsPresent, 1);
                const episodeIsPresent = modifiedSeason[0].episodes.findIndex(
                  el => +el.number === +episodeNumber
                );
                console.log(video.name, episodeIsPresent);
                if (episodeIsPresent === -1) {
                  modifiedSeason[0].episodes.push({
                    number: episodeNumber,
                    ref: video._id,
                  });
                  seasons.push(modifiedSeason[0]);
                  tvShow.seasons = seasons;
                  await tvShow.save();
                  console.log("tvshow updated - new episode");
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

    console.log("Ending discovering");
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

        if (isSubtitle) {
          if (ext.includes("srt")) {
            createReadStream(absolutePath + "/" + file.name)
              .pipe(srt2vtt())
              .pipe(createWriteStream(`${absolutePath}/${filename}.vtt`));

            // need to remove srt file
            console.log("===========");
            // TODO: log here to keep track of what we delete
            console.log("file to remove", absolutePath + "/" + file.name);
            console.log("===========");
            // rm(absolutePath + "/" + file.name, () => {}); // trick to avoid error
          }
          subtitleModel.create(
            {
              ext,
              path: absolutePath,
              name: filename,
            },
            (err, data) => {
              if (err) {
                console.error(err);
              }
              console.log("success", data);
            }
          );
          countSubtitleCreated++;
          continue;
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
