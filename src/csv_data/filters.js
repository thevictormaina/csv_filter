import path from "path";
import { get_file_text } from "../file.js";
import { parse_csv_from_file } from "./index.js";
import { warn } from "console";

/**
 * @param {[]} data
 * @param {Object} options
 * @param {string} options.field
 * @param {string[]} options.keywords
 * @param {"include" | "exclude"} options.mode
 */
export function filter_by_keyword(
  data,
  { field, keywords = [], mode = "include" },
) {
  if (keywords.length === 0) return data;

  /**
   * @type { typeof data }
   */
  const filtered = data.filter((entry) => {
    for (let keyword of keywords) {
      if (!entry[field]) continue;

      const current_field = entry[field].toLowerCase();
      const current_keyword = keyword.toLowerCase();

      if (mode === "include" && current_field.includes(current_keyword)) {
        return entry;
      } else if (
        mode === "exclude" &&
        !current_keyword.includes(current_keyword)
      ) {
        return entry;
      }
    }
  });

  return filtered;
}

/**
 * @typedef {{field: string, keywords: string[], mode: "include" | "exclude"}} Filter
 * @param {[]} data
 * @param {Filter[]} filters
 */
export function filter_by_keywords(data, filters) {
  const filtered = filters.reduce((prev_data, filter) => {
    return filter_by_keyword(prev_data, filter);
  }, data);

  return filtered;
}

export async function get_filters(filter_file) {
  const parsed = await parse_csv_from_file(filter_file, { header: true });
  /**
   * @type {Filter[]}
   */
  const filters = parsed.meta.fields.reduce((filters, field) => {
    const filter = { field, keywords: [], mode: "include" };
    parsed.data.forEach((entry) => {
      if (entry[field]) filter.keywords.push(entry[field]);
    });
    filters.push(filter);
    return filters;
  }, []);

  return filters;
}
