import path from "path"
import { findFiles } from "../../utils/fileManipulation"
import { videoModel } from "../../schemas/Video"
import srt2vtt from "srt-to-vtt"
import { createReadStream, createWriteStream, rm } from "fs"
import { subtitleModel } from "../../schemas/Subtitles"
import { tvShowModel } from "../../schemas/TvShow"
import fetch from "node-fetch"
import dotenv from "dotenv"

dotenv.config()

const matchExt = /(\w+)$/i
const matchLng = /(\w+).\w+$/
const regExBasename = /([ .\w']+?)($|mp3|[s|S]\d{1,}|\(.*\)|[A-Z]{2,}|\W\d{4}\W?.*)/
const movieDbUrl = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.API_MOVIEDB}&page=1&include_adult=false&language=en-US&query=`
const regexTvShow = /(s\d{1,2})(e\d{1,2})/i
const regexIsSubtitle = /(vtt|srt|sfv)/i

export default class DiscoverController {
  async discover(req, res) {
    let count = 0
    const subDirectories = []
    const basePath = path.resolve("./public/")
    const files = await findFiles(basePath)
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
    ]

    const goThrough = async (files, extraPath = "") => {
      for (const file of files) {
        const ext = path.extname(file.name)

        const exclude = excludedExtension.some(ext => file.name.includes(ext))

        if (exclude) continue

        if (file.isDirectory() || file.isSymbolicLink()) {
          //          console.log({file}, 'is directory')
          const sub = await findFiles(basePath + "/" + extraPath + "/" + file.name)
          subDirectories.push({
            directory: extraPath + "/" + file.name,
            content: sub.filter(el => !el.name.includes("DS_Store")),
          })
          continue
        }

        // Here we need to work the file
        const filename = path.basename(file.name, ext)
        const absolutePath = path.resolve(basePath + "/" + extraPath + "/")

        if (!regexIsSubtitle.test(ext)) {
          // It's a video we need to check if already exists in db first
          let basename = filename.match(regExBasename)

          if (!basename) {
            console.error("Something wrong has happened")
            // TODO: log here with filename
            console.error(filename)
          }

          basename = basename[1].replaceAll(".", " ").trim().toLowerCase()

          const isTvShow = filename.match(regexTvShow)
          const season = isTvShow && isTvShow[1].toLowerCase()
          const episode = isTvShow && isTvShow[2].toLowerCase()
          const name = isTvShow ? `${basename} ${season}${episode}` : basename

          // check if already exists
          const existInDb = await videoModel.find({ name })
          let video
          if (!existInDb.length) {
            const location = path.resolve(absolutePath + "/" + file.name)
            video = await videoModel.create({
              filename,
              basename,
              name,
              ext,
              location,
              type: isTvShow ? "tv" : "movie",
            })
            console.log("{video} created")
            // TODO: log here which video has been created with name and location
            console.log({ video })
          } else {
            video = existInDb[0]
          }

          if (isTvShow) {
            const seasonNumber = season.match(/(\d+)/)[0]
            const episodeNumber = episode.match(/(\d+)/)[0]
            console.log("{season, episode}")
            console.log({ season, episode })
            let tvShow = await tvShowModel.findOne({ name: basename })

            if (!tvShow) {
              tvShow = await tvShowModel.create({
                name: basename,
                seasons: [
                  {
                    number: seasonNumber,
                    episodes: [{ number: episodeNumber, ref: video._id }],
                  },
                ],
              })
              console.log("tvshow created")
              // TODO: log here which tvShow has been created with name and location
              console.log({ tvShow })
            } else {
              const { seasons } = tvShow
              const seasonIsPresent = seasons.findIndex(el => {
                console.log("is season present", +el.number, +seasonNumber)
                return +el.number === +seasonNumber
              })

              console.log({ seasonIsPresent })
              if (seasonIsPresent === -1) {
                seasons.push({
                  number: seasonNumber,
                  episodes: [{ number: episodeNumber, ref: video._id }],
                })
              } else {
                const modifiedSeason = seasons.splice(seasonIsPresent, 1)
                const episodeIsPresent = modifiedSeason[0].episodes.findIndex(
                  el => +el.number === +episodeNumber
                )
                if (episodeIsPresent === -1) {
                  modifiedSeason[0].episodes.push({
                    number: episodeNumber,
                    ref: video._id,
                  })
                  seasons.push(modifiedSeason[0])
                  tvShow.seasons = seasons
                }
              }

              await tvShow.save()
              console.log("tvshow updated")
              // TODO: log here which tvshow has been update with name and data
              console.log({ tvShow, seasons: tvShow.seasons })
              if (tvShow?.seasons[0]?.episodes?.length) {
                console.log({ episodes: tvShow.seasons[0].episodes })
              }
            }
          }

          count++
          continue
        }
      }

      while (subDirectories.length > 0) {
        const subDirectory = subDirectories.shift()
        await goThrough(subDirectory.content, subDirectory.directory)
      }
    }
    await goThrough(files)

    res.json(`${count} were added to db`)
  }

  discoverSubtitles() {
    const isSubtitle = regexIsSubtitle.test(ext)

    if (ext.includes("srt")) {
      createReadStream(absolutePath + file.name)
        .pipe(srt2vtt())
        .pipe(createWriteStream(`${absolutePath}${filename}.vtt`))
    }
    // need to remove srt file
    console.log("===========")
    console.log("file to remove", absolutePath + file.name)
    console.log("===========")
    //rm(absolutePath + file.name)

    subtitleModel.create(
      {
        ext,
        path: absolutePath,
        name: filename,
      },
      (err, data) => {
        if (err) {
          console.error(err)
        }
        console.log("success", data)
      }
    )
  }

  discoverDetails() {
    if (false) {
      console.log("============")
      console.log({ basename })
      console.log("============")
      // const response = await fetch(movieDbUrl + basename)
      // const result = await response.json()
      // console.log({ result })
    }
  }
}
