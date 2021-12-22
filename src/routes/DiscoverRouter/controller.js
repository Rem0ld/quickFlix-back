import path from 'path'
import { findFiles } from "../../utils/fileManipulation"

const matchExt = /(\w+)$/i;

class Video {
  constructor(basename, ext) {
    this.name = basename
    this.ext = ext.match(matchExt)[0] || ext
    this.subtitles = {}
  }

  addSubtitles (name, ext, lng) {
    if(!this.subtitles[lng]) {
      this.subtitles[lng] = [] 
    }
    this.subtitles[lng].push({
      name: name,
      ext
    })
  }
}

export default class DiscoverController  {
  
  
  async discover () {
    const videos = {}
    const subtitles = []
    const files = await findFiles(path.resolve('./public/'))

    files.forEach(file => {
      if(file.name.includes('DS_Store')) return 

      console.log(file['Symbol(type)'])

      const ext = path.extname(file.name)
      const basename = path.basename(file.name, ext)
      const isSubtitle = /(vtt|srt)/.test(ext)

      if(!isSubtitle) {
        const video = new Video(basename, ext)

        // console.log({video})
        videos[basename] = video
        
      } else {
        const lng = basename.match(matchExt)
        console.log({lng})
        
        const videoIsPresent = Object.keys(videos).find((name) => {
          basename.includes(name)
        })
        
        if(videoIsPresent) {
          videos[videoIsPresent].addSubtitles(basename, ext, lng[0])
        } else {
          subtitles.push(file)
        }
      }
      // console.log({videos, subtitles})
    })
  }
}