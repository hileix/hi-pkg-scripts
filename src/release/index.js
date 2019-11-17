'use strict';

async function main(branchName = 'master') {

  // 检查是否为发布分支
  require('./checkBranch')(branchName);

  // 检查当前分支是否有未 commit 的文件
  require('./checkCommit')();

  // 修改版本号
  const newVersion = require('./modifiedVersion')();

  // 发布
  require('./npmPublish')();

  // git push
  require('./gitPush')(branchName, newVersion, newVersion);

  // 根据 commit 生成 changelog
  require('./generateChangelogByCommit')();
}

module.exports = main;
