#!/usr/bin/env node

import path, { dirname } from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import { copyFolder } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

inquirer
  .prompt([
    {
      type: "input",
      name: "packageName",
      message: "Input target folder",
      validate(value) {
        const pass = value.match(/[^\/\s\.]/i);
        if (pass) return true;
        return "Please enter a valid folder name";
      },
    },
    {
      type: "list",
      message: "Select project type",
      name: "projectType",
      choices: [
        new inquirer.Separator("===Web App==="),
        {
          name: "React",
        },
        // TODO 待补充
      ],
      validate(answer) {
        if (answer.length === 0) return "You must choose at least one type.";
        return true;
      },
    },
  ])
  .then((answers) => {
    const target = path.join(process.cwd(), answers.packageName);
    const source = path.join(
      __dirname,
      "templates",
      answers.projectType.toLowerCase(),
    );
    copyFolder(source, target);
    //   (file, srcPath, destPath) => {
    //   if (file === '_gitignore') fs.copyFileSync(srcPath, destPath.replace(/_gitignore/g, '.gitignore'))
    //   else fs.copyFileSync(srcPath, destPath)
    // }
  });
