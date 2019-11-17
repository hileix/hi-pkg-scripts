"use strict";
const git = require('git-rev-sync');
const ora = require('ora');
const chalk = require('chalk');

/**
 * 检查分支是否在发布分支
 * @param {string} branchName 发布分支名称
 */
function checkBranch(branchName) {
  const spinner = ora().start(`开始验证分支是否为 ${branchName} 分支`);

  const currentBranch = git.branch(process.cwd());
  if (branchName.indexOf(currentBranch) === -1) {
    spinner.fail(`当前为 ${chalk.green(currentBranch)} 分支，请在 ${chalk.green(
      branchName
    )} 分支进行发布`);
    process.exit(1);
  }
  spinner.succeed('分支验证成功！');
}

module.exports = checkBranch;
