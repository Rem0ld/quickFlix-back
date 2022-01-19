import path from "path"
import { findFiles } from "../../utils/fileManipulation"
import { findSubtitles } from "../../utils/extractSubtitles"
import { writeFile } from "fs"

const matchExt = /(\w+)$/i
const matchLng = /(\w+).\w+$/
class Video {
  constructor(basename, ext, location) {
    this.name = basename
    if (ext.match(matchExt)) {
      this.ext = ext.match(matchExt)[0]
    } else {
      this.ext = ext
    }
    this.subtitles = {}
    this.path = path.dirname(location)
  }

  addSubtitles(name, ext, lng) {
    if (!this.subtitles[lng]) {
      this.subtitles[lng] = []
    }
    this.subtitles[lng].push({
      name: name,
      ext,
      path: path.dirname(this.path),
    })
  }
}
export default class DiscoverController {
  async discover(req, res) {
    let count = 0
    const videos = {}
    const subtitles = []
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
        const basename = path.basename(file.name, ext)
        const isSubtitle = /(vtt|srt|sfv)/.test(ext)

        if (!isSubtitle) {
          const videoPath = path.resolve(basePath + "/" + extraPath + "/" + file.name)
          const video = new Video(basename, ext, videoPath)
          videos[basename] = video
          count++
          // await findSubtitles(videoPath)
          const content = await findFiles(path.dirname(videoPath))
          getSubtitles(content, video)
          continue
        }

        // const lng = basename.match(matchExt)

        // // console.log({lng})
        // const videoIsPresent = Object.keys(videos).find(name => {
        //   return basename.includes(name)
        // })
        // //console.log({videoIsPresent})

        // if (videoIsPresent) {
        //   videos[videoIsPresent].addSubtitles(basename, ext, lng[0])
        // } else {
        //   subtitles.push(file)
        // }
      }

      while (subDirectories.length > 0) {
        console.log({ subDirectories })
        const subDirectory = subDirectories.shift()
        await goThrough(subDirectory.content, subDirectory.directory)
      }
    }
    await goThrough(files)
    // console.log({ videos, subtitles, subDirectories })
    const json = JSON.stringify(videos)
    writeFile("movies.json", json, "utf-8", () => {
      res.json(`Success, we found ${count} videos`)
    })
  }
}

const getSubtitles = (files, video) => {
  for (const file of files) {
    const ext = path.extname(file.name)
    if (ext.includes(".vtt")) {
      const basename = path.basename(file.name)
      const lng = basename.match(matchLng)
      video.addSubtitles(basename, ext, lng[1])
    }
  }
}
