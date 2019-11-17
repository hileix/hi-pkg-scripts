#!/usr/bin/env node
"use strict";

const ora = require('ora');
const strsplit = require('strsplit');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const path = require('path');
const { projectPath } = require('../dev');

function generateChangelogByCommit() {
  const spinner = ora().start('开始生成 changelog');

  const commitMessage = execSync('git log --oneline', {
    encoding: 'utf8'
  });

  const arr = strsplit(commitMessage, /\n/).filter(Boolean);

  let commitArr = [], i = 0, title = arr[0] ? arr[0].replace(/^[0-9a-z]{7} /g, '## ') : '';
  arr.forEach(s => {
    if (i < 2) {
      if (/Release v/.test(s)) {
        i++;
      } else {
        s = s.replace(/^[0-9a-z]{7} /g, '- ');
        commitArr.push(s);
      }
    }
  });

  const commitStr = commitArr.join(`\n`)
  const extraContent = `${title}\n${commitStr}\n\n`;

  const changelogPath = path.resolve(projectPath, 'changelog.md');
  fs.ensureFileSync(changelogPath);
  const changelogContent = fs.readFileSync(changelogPath)
  const content = `${extraContent}${changelogContent}`;
  fs.writeFileSync(changelogPath, content);

  spinner.succeed(`在 ${changelogPath} 生成 changlog 成功！请依据实际情况修改 changelog。`);

  process.exit();
}

module.exports = generateChangelogByCommit;
