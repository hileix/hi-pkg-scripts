'use strict';

const { pkg } = require('../dev');

async function main(branchName = 'master') {

  // 检查是否为发布分支
  require('./checkBranch')(branchName);

  // 检查当前分支是否有未 commit 的文件
  require('./checkCommit')();

  // 修改版本号
  const newVersion = await require('./modifiedVersion')();

  // 发布
  require('./npmPublish')();

  // git push
  require('./gitPush')(branchName, newVersion, newVersion);

  // 根据 commit 生成 changelog，默认不生成
  let isGenerate = false;
  if (pkg['hi-pkg-scripts'] && pkg['hi-pkg-scripts'].release && pkg['hi-pkg-scripts'].release.generateChangelog) {
    isGenerate = true;
  }
  isGenerate && require('./generateChangelogByCommit')();
}

module.exports = main;
