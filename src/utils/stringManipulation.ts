
/**
 * Simple version of replaceAll, as TS doesn't let me use it!!!
 * @param target string 
 * @param s string what we wanna change
 * @param repl string replacement string
 * @returns string the changed string
 */
export function replaceAll(target: string, s: string, repl: string): string {
  return target.split(s).join(repl)
}

/**
 * Modify he video name replacing points by spaces, trim and lower case the string
 * @param s string
 * @returns new string
 */
export const parseBasename = (s: string) => {
  return replaceAll(s, ".", " ").trim().toLowerCase();
};


