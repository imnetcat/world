"use strict";
const fs = require("fs");
const childProcess = require("child_process");
const path = require("path");

const files = process.argv.slice(2);
const haveArgs = files.length !== 0;
const workspaceFiles = {};
const { workspaces } = JSON.parse(fs.readFileSync("package.json", "utf8"));
const root = "panel";
const includedEslintExtensions = [".js", ".tsx", ".jsx", ".ts", ".md"];
const includedExtensions = [
  ".js",
  ".tsx",
  ".jsx",
  ".ts",
  ".scss",
  ".json",
  ".md",
];
const excludedExtensions = [".d.ts"];

if (haveArgs) {
  for (const file of files) {
    const [workspace, ...workspaceFilePath] = file.split("/");
    if (
      (!workspaces.includes(workspace) && workspaceFilePath.length !== 0) ||
      !includedExtensions.some((extension) => file.endsWith(extension)) ||
      excludedExtensions.some((extension) => file.endsWith(extension))
    )
      continue;
    const folder = workspaceFilePath.length !== 0 ? workspace : root;
    const inner =
      workspaceFilePath.length !== 0
        ? path.join(...workspaceFilePath)
        : workspace;
    workspaceFiles[folder] = workspaceFiles[folder]
      ? [...workspaceFiles[folder], inner]
      : [inner];
  }
}
const maxWorkspaceNameLength = Math.max(...workspaces.map((str) => str.length));

const PALETTE = [
  [0, 219, 137],
  [0, 202, 182],
  [0, 191, 211],
  [0, 208, 167],
  [0, 173, 255],
  [0, 196, 196],
];
const ERR_PALETTE = [
  [255, 219, 137],
  [255, 202, 182],
  [255, 185, 226],
  [255, 191, 211],
  [255, 173, 255],
  [255, 196, 196],
];

let color = 0;
const getColors = () => {
  color = (color + 1) % PALETTE.length;
  return [PALETTE[color], ERR_PALETTE[color]];
};

const colorText =
  ([r, g, b]) =>
  (text) =>
    `\u001b[38;2;${r};${g};${b}m${text}\u001b[0m`;

const log = (linePrefix) => (data) =>
  process.stdout.write(
    data
      .split("\n")
      .filter((str, i, arr) => i + 1 !== arr.length || str !== "")
      .map((line) => `${linePrefix} ${line}\n`)
      .join("")
  );

const cmdPrefix = (workspace) => `npm run --prefix ${workspace}`;
const workspacePrefix = (workspace) =>
  `${workspace}\u001b[${maxWorkspaceNameLength - workspace.length + 1}C`;

const runCmd = (cmd, name) =>
  new Promise((resolve, reject) => {
    const [info, err] = getColors().map(colorText);
    const child = childProcess.exec(cmd, (err) => (err ? reject() : resolve()));

    child.stdout.on("data", log(info(`stdout@${name}`)));
    child.stderr.on("data", log(err(`stderr@${name}`)));
    child.on("error", ({ message }) => log(err(`error @${name}`))(message));
  });

const runFmtCheck = (workspace, files = []) =>
  runCmd(
    `${
      (files.length !== 0 &&
        `${cmdPrefix(workspace)} fmt:check:exact ${files.join(" ")}`) ||
      "echo Nothing changed"
    }`,
    `${workspacePrefix(workspace)} | [fmt:check]`
  );
const runLintAndTest = (workspace, files = []) => {
  const lint = files.length !== 0;
  // TODO should actually pass files to test command if possible
  const test = false;
  const lintCmd =
    (lint &&
      `${cmdPrefix(workspace)} lint:exact ${files
        .filter((file) =>
          includedEslintExtensions.some((ext) => file.endsWith(ext))
        )
        .join(" ")} --no-error-on-unmatched-pattern`) ||
    "echo Nothing changed";
  const testCmd =
    (test && `${cmdPrefix(workspace)} test`) ||
    "echo No testable files changed";
  return (async () => {
    const lint = runCmd(lintCmd, `${workspacePrefix(workspace)} | [lint]`);
    const test = runCmd(testCmd, `${workspacePrefix(workspace)} | [test]`);
    await lint;
    await test;
  })();
};

Promise.allSettled(
  [...workspaces, root]
    .map((workspace) =>
      workspace !== root
        ? [
            runFmtCheck(workspace, workspaceFiles[workspace]),
            runLintAndTest(workspace, workspaceFiles[workspace]),
          ]
        : [
            runCmd(
              workspaceFiles[root]
                ? `prettier -c ${workspaceFiles[root].join(" ")}`
                : "echo Nothing changed",
              `${workspacePrefix(root)} | [fmt:check]`
            ),
            runCmd(
              workspaceFiles[root]
                ? `echo "Handy3 lint" && eslint -c backend/.eslintrc.json ${
                    workspaceFiles[root]
                      .filter((file) => !file.endsWith(".json"))
                      .join(" ") || ""
                  } --no-error-on-unmatched-pattern`
                : "echo Nothing changed",
              `${workspacePrefix(root)} | [lint]`
            ),
          ]
    )
    .flat()
).then(
  (results) =>
    process.exit(
      results
        .map((result) => result.status)
        .some((status) => status === "rejected")
    ),
  (reason) => {
    console.error(reason);
    process.exit(1);
  }
);
