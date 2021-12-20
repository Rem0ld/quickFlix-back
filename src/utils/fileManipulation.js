import { promises, access, constants } from 'fs'
import path from 'path'

export async function subtitleExists(subPath) {
  // const extension = ['.srt', '.vtt']

  // extension.forEach(element => {
  //   fs.access(path + element, mode, callback)
  // })
  console.log('======================')

  return access(`./public/${subPath}.vtt`, constants.F_OK, (err) => {
    console.log(`./public/${subPath}.vtt ${err ? 'does not exist' : 'exists'}`);
    return err ? true : false
  });
}