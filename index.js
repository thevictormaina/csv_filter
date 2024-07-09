import { parse, unparse } from "papaparse";
import { resolve } from "path";
import { open, writeFile } from "fs/promises";
import { createInterface } from "node:readline";
import { stdin as input, stdout as output } from "node:process";

const rl = createInterface({ input, output });

console.log(
  `Welcome to Automa8 AI CSV Filter! You're going to need two things to get started:\n1. A CSV file of keywords.\n2. A CSV file containing the data you want to filter.\nLet's get parsing...\n`,
);

async function get_keywords(
  message = "Enter the path to the keywords CSV file:\n",
) {
  const keywords_path = await new Promise((res, _) => {
    rl.question(message, (ans) => {
      if (!ans || ans === "") {
        return get_keywords(
          "You have not entered a file path. Please try again:\n",
        );
      }
      res(resolve(ans));
    });
  });

  try {
    const handle = await open(keywords_path);
    const keywords_str = (await handle.readFile("utf8")).toLowerCase().trim();

    handle.close();
    const keywords = keywords_str.split(/,|\n/).map((s) => s.trim());

    console.log(`${keywords.length} keyword(s) added successfully.\n`);

    return keywords;
  } catch {
    return get_keywords("Invalid file. Please try again:\n");
  }
}

async function get_csv_data(
  message = "Enter the path to the data CSV file:\n",
) {
  const data_path = await new Promise((res, _) => {
    rl.question(message, (ans) => {
      if (!ans || ans === "") {
        return get_keywords(
          "You have not entered a file path. Please try again:\n",
        );
      }
      res(resolve(ans));
    });
  });

  try {
    const handle = await open(data_path);
    const data_str = await handle.readFile("utf8");
    handle.close();

    const { data, errors } = parse(data_str.trim(), { header: true });

    console.log(`\n${data.length} rows(s) parsed successfully.`);
    if (errors.length > 0) {
      errors.forEach((err) => console.error(err.message + "\n"));
    }

    return data;
  } catch {
    return get_keywords("Invalid file. Please try again:\n");
  }
}

/**
 * @param {string} bio
 * @param {string[]} keywords
 */
function contains_keywords(bio, keywords) {
  if (!bio) return false;

  bio = bio.toLowerCase();
  let i = 0;
  while (i < keywords.length) {
    if (bio.includes(keywords[i])) return true;
    i++;
  }
  return false;
}

/**
 * @param {string} email
 */
function is_business_email(email) {
  if (!email || email === "") return false;

  email = email.trim().toLowerCase();

  const generic_emails_domains = [
    "gmail",
    "outlook",
    "yahoo",
    "hotmail",
    "mail.com",
    "icloud.com",
    "aol.com",
  ];

  let i = 0;
  while (i < generic_emails_domains.length) {
    if (email.includes(generic_emails_domains[i])) return false;
    i++;
  }

  return true;
}

function filter_rows(keywords, data) {
  console.log("\nFiltering data using keywords...");

  const filtered = data.filter((entry) => {
    return (
      contains_keywords(entry.bio, keywords) && is_business_email(entry.email)
    );
  });

  console.log(`${filtered.length} matches found.\n`);

  return filtered;
}

async function write_to_csv(
  data,
  message = "Enter a path to save new file:\n",
) {
  const new_csv_path = await new Promise((res, _) => {
    rl.question(message, (ans) => {
      if (!ans || ans === "") {
        return write_to_csv(
          "You have not entered a file path. Please try again:\n",
        );
      }
      res(resolve(ans));
    });
  });

  try {
    console.log("\nWriting data to new CSV file...");

    const csv_str = unparse(data, { header: true });

    await writeFile(resolve(new_csv_path), csv_str);

    console.log(
      `Successfully added results to new CSV file at path: ${new_csv_path}`,
    );
  } catch (err) {
    console.error(err);
    return write_to_csv("Invalid file. Please try again:\n");
  }
}

async function main() {
  const keywords = await get_keywords();
  const data = await get_csv_data();
  const filtered = filter_rows(keywords, data);

  await write_to_csv(filtered);

  rl.close();
}

main();
