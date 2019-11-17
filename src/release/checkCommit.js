"use strict";
const { log } = require('../utils');
const chalk = require('chalk');
const { execSync } = require('child_process');
const ora = require('ora');


/**
 * 检查当前分支是否有未 commit 的文件
 */
function checkCommit() {
  const spinner = ora().start('开始验证是否有未 commit 的文件');

  const keyStrArr = [
    'Changes not staged for commit:',
    'Changes to be committed:',
    'Untracked files:'
  ];
  let out;
  try {
    out = execSync('git status');
  } catch (error) {
    log(chalk.red(err.message));
    process.exit(1);
  }
  let isClean = true;
  keyStrArr.forEach(keyStr => {
    if (out.indexOf(keyStr) !== -1) {
      isClean = false;
    }
  });
  if (!isClean) {
    spinner.fail(`当前有文件未 commit，请先 commit！`);
    process.exit(1);
  }
  spinner.succeed('commit 验证成功！');
}

module.exports = checkCommit;
