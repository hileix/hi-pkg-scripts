"use strict";
const ora = require('ora');
const { execCommand, log } = require('../utils');
const chalk = require('chalk');

/**
 * git push
 * @param {string} branchName 分支名称
 * @param {string} tagName 标签名称
 * @param {string} version 版本
 */
function gitPush(branchName, tagName, version) {
  const spinner = ora().start('开始 git add/commit/push');

  // push branch
  execCommand('git add .');
  execCommand(`git commit -m "Release v${version}"`);
  execCommand(`git push origin ${branchName}`);

  // push tag
  execCommand(`git tag ${tagName}`);
  execCommand(`git push origin ${tagName}`);


  spinner.succeed(`git add/commit/push 成功！`);
}

module.exports = gitPush;
