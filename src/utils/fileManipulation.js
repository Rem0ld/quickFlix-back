import { accessSync, constants, createWriteStream, readdirSync } from "fs";
import client from "https";

export function subtitleExists(subPath) {
  // const extension = ['.srt', '.vtt']

  // extension.forEach(element => {
  //   fs.access(path + element, mode, callback)
  // })
  try {
    accessSync(subPath + ".vtt", constants.R_OK);
  } catch (error) {
    return false;
  }

  return true;
}

export async function findFiles(dir) {
  return readdirSync(dir, { withFileTypes: true });
}

export async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    client.get(url, res => {
      if (res.statusCode === 200) {
        res
          .pipe(createWriteStream(filepath))
          .on("error", reject)
          .once("close", () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request failed with status code ${res.statusCode}`));
      }
    });
  });
}
