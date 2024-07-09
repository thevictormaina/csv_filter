import { warn } from "console";
import fs from "fs/promises";
import { resolve, extname } from "path";

const base_path = process.cwd();

/**
 * @param {string | import("fs/promises").FileHandle} path
 */
export async function get_file_text(file, trim = true) {
  try {
    /** @type {import("fs/promises").FileHandle} */
    let handle;

    if (typeof file === "string") {
      handle = await fs.open(file);
    } else handle = file;

    let txt = await handle.readFile("utf8");
    if (trim) txt = txt.trim();

    handle.close();

    return txt;
  } catch (err) {
    console.error(err);
  }
}

/**
 * @param {string} dir_path
 * @param {string[] | undefined} extentions
 */
export async function get_dir_files(dir_path, extentions) {
  /** @type {string[]} */
  const file_paths = [];

  try {
    const dir = await fs.opendir(resolve(dir_path));

    for await (let file of dir) {
      if (!file || !file.isFile()) continue;
      if (
        extentions &&
        extentions.length > 0 &&
        !extentions.includes(extname(file.name))
      )
        continue;

      const file_path = resolve(dir_path, file.name);
      file_paths.push(file_path);
    }

    return file_paths;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Remove beginning and ending quoation marks
 * @param {string} path_string
 */
export function remove_path_quotation_marks(path_string) {
  if (path_string[0] === '"') path_string = path_string.slice(1);
  if (path_string[path_string.length - 1] === '"') {
    path_string = path_string.slice(0, path_string.length - 1);
  }

  return path_string;
}

/**
 * @param {string} data
 * @param {string | import("fs/promises").FileHandle} destination
 */
export async function write_text_file(destination, data) {
  try {
    await fs.writeFile(destination, data, { encoding: "utf8" });
  } catch (err) {
    console.error(err);
  }
}
