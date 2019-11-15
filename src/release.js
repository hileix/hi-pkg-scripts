'use strict';
const inquirer = require('inquirer');
const semver = require('semver');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { spawnSync, spawn, execSync } = require('child_process');
const git = require('git-rev-sync');
const sgf = require('staged-git-files');
const ora = require('ora');

const pkg = require(path.resolve(process.cwd(), 'package.json'));

const oldVersion = pkg.version;
const log = console.log;

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

const spinner = ora().start();

main();

async function main() {

  validateBranch();

  await validateCommit();

  const { isConfirmed, newVersion } = await generateNewVersion();

  if (!isConfirmed) {
    process.exit(1);
  }

  modifiedVersion(newVersion);

  publish();

  gitPush(newVersion);
}

/**
 * 验证是否是在主分支（只能在主分支发布）
 */
function validateBranch() {
  spinner.start('开始验证分支是否为 master 分支')
  const currentBranch = git.branch(process.cwd());
  if ('master'.indexOf(currentBranch) === -1) {
    spinner.fail(`当前为 ${chalk.green(currentBranch)} 分支，请在 ${chalk.green(
      'master'
    )} 分支进行发布`);
    process.exit(1);
  }
  spinner.succeed('分支验证成功！');
}

/**
 * 验证是否有未提交的
 */
async function validateCommit() {
  spinner.start('开始验证是否有未 commit 的文件');

  async function hasNoCommitFile() {
    const stagedFiles = await sgf();
    const arr = ['Added', 'Modified'];
    const result = stagedFiles.filter(item => arr.includes(item.status));
    return result.length > 0;
  }
  const isNoCommitFile = await hasNoCommitFile();
  if (isNoCommitFile) {
    spinner.fail(`当前有文件未 commit，请先 commit！`);
    process.exit(1);
  }
  spinner.succeed('commit 验证成功！');
}

/**
 * 生成新的版本号
 * @return {object} object.version 生成的新的版本号是否有效; object.newVersion 新的版本号
 */
async function generateNewVersion() {
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
  return { isConfirmed: answers.isConfirmed, newVersion };
}

/**
 * 修改版本号
 * @param {string} version 版本号
 */
function modifiedVersion(version) {
  spinner.text = '开始修改版本号';
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
}

/**
 * 发布到 npm
 */
function publish() {
  spinner.start('开始 publish');
  execCommand('npm publish --access public', {
    onError: () => {
      // publish 失败，则 checkout 掉 package.json 文件
      execCommand('git checkout package.json');
      spinner.fail(`publish 失败！`);
    }
  });
  spinner.succeed(`publish 成功！`);
}

/**
 * 将修改的 package.json push
 * @param {string} version release 版本
 */
function gitPush(version) {
  spinner.start('开始 git add/commit/push');

  // push branch
  execCommand('git add .');
  execCommand(`git commit -m "Release v${version}"`);
  execCommand('git push origin master');

  // push tag
  execCommand(`git tag ${version}`);
  execCommand(`git push origin ${version}`);
  spinner.succeed(`git add/commit/push 成功！`);
}

/**
 * 执行命令且打印相关的命令以及命令执行后的返回值
 * @param {string} command 命令
 * @param {function} onSuccess 命令执行成功后的回调
 * @param {function} onError 命令执行失败后的回调
 */
function execCommand(
  command,
  options = { onSuccess: undefined, onError: undefined }
) {
  const { onSuccess, onError } = options;
  log(`\n${command}`);
  let result;
  try {
    result = execSync(command, {
      encoding: 'utf8'
    });
  } catch (err) {
    log(chalk.red(err.message));
    onError && onError();
    process.exit(1);
  }
  log(result);
  onSuccess && onSuccess();
}

async function sleep(t) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, t)
  })
}