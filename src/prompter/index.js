import { stdin as input, stdout as output } from "process";
import { createInterface } from "readline";
import path from "path";
import { readFile } from "fs/promises";
import { get_file_text } from "../file.js";

const messages_path = path.resolve(process.cwd(), "src");
export const rl = createInterface({ input, output });

/**
 * @param {string} message
 */
export async function prompt(message) {
  /**
   * @type {Promise<string>}
   */
  const ans = new Promise((res) => {
    rl.question(message, (ans) => res(ans));
  });

  return await ans;
}

/**
 * @param {string} path
 */
export async function prompt_from_file(path) {
  let txt = await get_file_text(path);
  txt = "\n" + txt + " ";
  return prompt(txt);
}

/**
 * @param {string} message
 */
export function log(message) {
  // rl.setPrompt(message);
  // rl.prompt();
  rl.write(message);
  // console.log(message);
}

/**
 * @param {string} path
 */
export async function log_from_file(path) {
  const txt = await get_file_text(path);
  log(txt);
}

export function close_prompter() {
  rl.close();
}
