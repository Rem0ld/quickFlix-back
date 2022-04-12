import { accessSync, constants, createWriteStream, existsSync, mkdirSync, readdirSync } from "fs";
import client from "https";
import path from "path";

export function fileExists(filepath: string) {
  try {
    accessSync(filepath, constants.R_OK);
  } catch (error) {
    return false;
  }

  return true;
}

export function subtitleExists(subPath: string) {
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

export async function findFiles(dir: string) {
  return readdirSync(dir, { withFileTypes: true });
}

export async function downloadImage(url: string, filepath: string): Promise<string> {
  if (!existsSync(path.dirname(filepath))) {
    mkdirSync(path.dirname(filepath), { recursive: true })
  }
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

export function findBaseFolder(filepath: string, folderName: string): string {
  if (!folderName || !filepath) return "";
  const splited = filepath.split(path.sep);
  const position = splited.indexOf(folderName);
  return splited[position + 1] || splited[position];
}