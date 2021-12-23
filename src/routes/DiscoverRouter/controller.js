import path from "path"
import { findFiles } from "../../utils/fileManipulation"
import { findSubtitles } from "../../utils/extractSubtitles"

const matchExt = /(\w+)$/i
const matchLng = /(\w+).\w+$/
class Video {
  constructor(basename, ext, path) {
    this.name = basename
    this.ext = ext.match(matchExt)[0] || ext
    this.subtitles = {}
    this.path = path
  }

  addSubtitles(name, ext, lng) {
    if (!this.subtitles[lng]) {
      this.subtitles[lng] = []
    }
    this.subtitles[lng].push({
      name: name,
      ext,
    })
  }
}
export default class DiscoverController {
  async discover() {
    const videos = {}
    const subtitles = []
    const subDirectories = []
    const basePath = path.resolve("./public/")
    const files = await findFiles(basePath)

    const goThrough = async (files, extraPath = "") => {
      for (const file of files) {
        const ext = path.extname(file.name)

        if (file.name.includes("DS_Store") || ext.includes("nfo")) continue

        // console.log(files, extraPath)
        if (file.isDirectory()) {
          const sub = await findFiles(basePath + "/" + extraPath + "/" + file.name)
          subDirectories.push({
            directory: extraPath + "/" + file.name,
            content: sub.filter(el => !el.name.includes("DS_Store")),
          })
          continue
        }
        const basename = path.basename(file.name, ext)
        const isSubtitle = /(vtt|srt)/.test(ext)

        if (!isSubtitle) {
          const videoPath = path.resolve(basePath + "/" + extraPath + "/" + file.name)
          const video = new Video(basename, ext, videoPath)
          videos[basename] = video
          await findSubtitles(videoPath)
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
        const subDirectory = subDirectories.shift()
        await goThrough(subDirectory.content, subDirectory.directory)
      }
    }
    await goThrough(files)
    console.log({ videos, subtitles, subDirectories })
    
  }
}

const getSubtitles = (files, video) => {
  for (const file of files) {
    const ext = path.extname(file.name)
    if(ext.includes('.vtt')) {
      const basename = path.basename(file.name)
      const lng = basename.match(matchLng)
      video.addSubtitles(basename, ext, lng[1])
    }
  }

}