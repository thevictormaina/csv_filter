import path from "path";
import {
  rl,
  log_from_file,
  prompt_from_file,
  prompt,
  log,
} from "./prompter/index.js";
import {
  parse_csv_from_dir,
  parse_csv_from_file,
  unparse_csv_data,
} from "./csv_data/index.js";
import { get_filters, filter_by_keywords } from "./csv_data/filters.js";
import { remove_path_quotation_marks, write_text_file } from "./file.js";

const BASE_PATH = path.resolve(process.cwd(), "src");

// Introduction
await prompt_from_file(path.resolve(BASE_PATH, "messages/intro.txt"));
rl.clearLine(0);

{
  // Get filters
  let res = await prompt_from_file(
    path.resolve(BASE_PATH, "messages/enter_filter_path.txt"),
  );
  res = remove_path_quotation_marks(res);

  const filters = await get_filters(res);
  const filter_cols = filters.map((filter) => filter.field).join(" | ");
  res = await prompt(
    `Press <Enter> to conitue filtering the following columns.\n${filter_cols}`,
  );

  // Import CSV files
  let parsed_csv;
  // res = await prompt_from_file(
  // path.resolve(BASE_PATH, "messages/file_or_dir.txt"),
  // );

  // if (res == 1) {
  // Filter single file CSV
  res = await prompt_from_file(
    path.resolve(BASE_PATH, "messages/select_single_file_path.txt"),
  );
  res = remove_path_quotation_marks(res);
  parsed_csv = await parse_csv_from_file(res, { header: true });

  log(`Successfully parsed ${parsed_csv.data.length} items.\n`);
  log(`Applying ${filters.length} filter(s)...`);

  const filtered_data = filter_by_keywords(parsed_csv.data, filters);
  log(`Successfully filtered ${filtered_data.length} items.\n`);

  // Write to output path
  res = remove_path_quotation_marks(
    await prompt_from_file(
      path.resolve(BASE_PATH, "messages/enter_output_path.txt"),
    ),
  );
  const csv_txt = unparse_csv_data(filtered_data);
  await write_text_file(res, csv_txt);

  log(`Successfully filtered CSV file. Congrats!`);
  //} else if (res == 2) {
  // Filter dir of CSV files
  // res = remove_path_quotation_marks(
  // await prompt_from_file(
  // // path.resolve(BASE_PATH, "messages/enter_csv_dir.txt"),
  // ),
  // );
  // parsed_csv = await parse_csv_from_dir(res, { header: true });
  //
  // log(`Successfully parsed ${parsed_csv.data.length} items.\n`);
  // log(`Applying ${filters.length} filter(s)...`);
  //
  // const filtered_data = filter_by_keywords(parsed_csv.data, filters);
  // log(`Successfully filtered ${filtered_data.length} items.\n`);
  //
  // // Write to output path
  // res = remove_path_quotation_marks(
  // await prompt_from_file(
  // path.resolve(BASE_PATH, "messages/enter_output_path.txt"),
  // ),
  // );
  // const csv_txt = unparse_csv_data(filtered_data);
  // await write_text_file(res, csv_txt);
  //
  // log(`Successfully filtered CSV file. Congrats!`);
  // }
}
rl.close();
// async function main() {
// const keywords = await get_keywords();
// const data = await get_csv_data();
// const filtered = filter_rows(keywords, data);
//
//
// await write_to_csv(filtered);
//
// rl.close();
// }
//

// const keywords = await get_keywords();
// const data = await get_csv_data();
// const filtered_data = await filter_data({ keywords, data });
//
// await write_to_csv(filtered_data);
//
// rl.close();
