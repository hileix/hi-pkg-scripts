"use strict";

const inquirer = require('inquirer');
const semver = require('semver');
const path = require('path');
const { projectPath } = require('../dev');
const { log } = require('../utils');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');

const pkg = require(`${projectPath}/package.json`);
const oldVersion = pkg.version;

const versionTypeMap = {
  主要版本: 'major',
  次要版本: 'minor',
  修订号: 'patch'
};

const questionOne = {
  type: 'list',
  name: 'versionType',
  message: '你要更新那个版本？',
  choices: ['主要版本', '次要版本', '修订号']
};

async function modifiedVersion() {
  let answers = await inquirer.prompt(questionOne);
  const { versionType } = answers;
  const newVersion = semver.inc(oldVersion, versionTypeMap[versionType]);
  log(chalk.red(`旧版本：${oldVersion}`));
  log(chalk.green(`新版本：${newVersion}`));
  const questionTwo = {
    type: 'confirm',
    name: 'isConfirmed',
    message: `您确定发布 ${newVersion} 版本吗?`,
    default: true
  };
  answers = await inquirer.prompt(questionTwo);
  const { isConfirmed } = answers;

  // 用户未确认，则退出
  if (!isConfirmed) {
    process.exit(1);
  }
  return modifiedPackageVersion(newVersion);
}

/**
 * 修改 package.json version 字段
 * @param {string} version 版本号
 */
function modifiedPackageVersion(version) {
  const spinner = ora().start('开始修改版本号');
  pkg.version = version;
  try {
    fs.writeFileSync(
      path.join(process.cwd(), 'package.json'),
      JSON.stringify(pkg, null, 2),
      {
        encoding: ''
      }
    );
  } catch (err) {
    spinner.fail(`修改版本号失败：${err.message}`);
    process.exit(1);
  }
  spinner.succeed(`修改版本号成功！`);
  return version;
}


module.exports = modifiedVersion;