import { accessSync, constants, readdirSync } from 'fs'
import path from 'path';

export function subtitleExists(subPath) {
  // const extension = ['.srt', '.vtt']

  // extension.forEach(element => {
  //   fs.access(path + element, mode, callback)
  // })
  try {
   accessSync(path.resolve(`./public/${subPath}.vtt`), constants.R_OK); 
  } catch (error) {
    return false
  }

  return true
}

export async function findFiles(dir) {
  return readdirSync(dir, {withFileTypes: true})
}

