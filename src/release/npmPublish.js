"use strict";
const git = require('git-rev-sync');
const ora = require('ora');
const { execCommand } = require('../utils');

/**
 * npm publish
 */
function npmPublish() {
  const spinner = ora().start();

  spinner.start('开始 publish');
  execCommand('npm publish --access public', {
    onFail: () => {
      // publish 失败，则 checkout 掉 package.json 文件
      execCommand('git checkout package.json');
      spinner.fail(`publish 失败！`);
    }
  });
  spinner.succeed(`publish 成功！`);
}

module.exports = npmPublish;
