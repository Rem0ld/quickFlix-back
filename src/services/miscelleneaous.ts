import { Dirent, opendirSync } from "fs";
import path, { ParsedPath } from "path";
import { logger } from "../libs/logger";

/**
 * Creates a file that references all wanted (regex) files (absolute path) from a directory - use recursion to follow all subfolder
 * @param {String} root Directory to be searched
 * @param {String} filename name of the file created
 * @param {RegExp} regex Type of file we want
 */
export async function go(
  root: string,
  tempFileName: string,
  regex: RegExp,
  list: ParsedPath[]
): Promise<ParsedPath[]> {
  try {
    const dir = opendirSync(root);
    let dirent: Dirent;
    while ((dirent = dir.readSync()) !== null) {
      if (dirent.isFile()) {
        if (regex.test(dirent.name)) {
          const parsed = path.parse(dir.path + path.sep + dirent.name);
          // appendFile(tempFileName, `${JSON.stringify(parsed)}\n`, () => {});
          list.push(parsed);
        }
      } else {
        await go(dir.path + "/" + dirent.name, tempFileName, regex, list);
      }
    }
    await dir.close();
    return list;
  } catch (err) {
    logger.error(err);
  }
}

export function showDir(root: string) {
  const dir = opendirSync(root);
  const list = [];
  let dirent: Dirent;

  while ((dirent = dir.readSync()) !== null) {
    console.log(dirent);
    if (dirent.isDirectory()) {
      list.push(dirent.name);
    }
  }
  dir.closeSync();

  console.log(list);
  return list;
}
