import path from "path";
import fs from "fs/promises";
import { get_dir_files, get_file_text } from "../file.js";
import Parse from "papaparse";

/**
 * @param {string} csv_text
 * @param {{ header: boolean; delimiter: string; }} [options={ header: true, delimiter }]
 */
export function parse_csv_text(csv_text, options) {
  const parsed = Parse.parse(csv_text, options);
  return parsed;
}

/**
 * @param {import("fs/promises").FileHandle | string} csv_file
 * @param {{ header: boolean; delimiter: string; }} [options={ header: true, delimiter }]
 */
export async function parse_csv_from_file(csv_file, options) {
  try {
    let txt = await get_file_text(csv_file);
    const parsed = parse_csv_text(txt, options);

    return parsed;
  } catch (err) {
    console.error(err);
  }
}

/**
 * @param {Parse.ParseResult} parsed_csv
 */
export function get_csv_schema(parsed_csv) {
  const schema = parsed_csv.meta.fields;
  return schema;
}

/**
 * @param {string} dir_path
 */
export async function parse_csv_from_dir(dir_path) {
  try {
    const csv_paths = await get_dir_files(dir_path, [".csv"]);

    const parsed = [];

    for (let csv_path of csv_paths) {
      let parsed = await parse_csv_from_file(csv_path, { header: true });
      parsed = null;
    }

    // const parsed_arr = await Promise.allSettled(
    // csv_paths.map(async (handle) => await get_csv_from_file(handle)),
    // );
    //return parsed_arr;
  } catch (err) {
    console.error(err);
  }
}

/**
 * @param {[]} data
 */
export function unparse_csv_data(data) {
  const txt = Parse.unparse(data, { header: true });
  return txt;
}
