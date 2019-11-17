"use strict";
const chalk = require('chalk');
const { execSync } = require('child_process');

const log = console.log;

/**
 * 执行命令且打印相关的命令以及命令执行后的返回值
 * @param {string} command 命令
 * 
 * @param {object} callbacks 回调函数 
 * @param {function} callbacks.onStart 开始执行命令的回调：(command) => void；result 表示执行后返回的结果
 * @param {function} callbacks.onSuccess 命令执行成功后的回调：(out) => out 表示执行后返回的结果，为字符串
 * @param {function} callbacks.onFail 命令执行失败后的回调：(errorMessage) => void；errorMessage 表示错误信息
 */
function execCommand(
  command,
  callbacks = { onSuccess: null, onFail: null }
) {
  const { onStart, onSuccess, onFail } = callbacks;
  log(`\n${command}`);
  let out;
  onStart && onStart(command);
  try {
    out = execSync(command, {
      encoding: 'utf8'
    });
  } catch (err) {
    log(chalk.red(err.message));
    onFail && onFail();
    process.exit(1);
  }
  log(out);
  onSuccess && onSuccess(out);
}

/**
 * 暂停睡眠
 * @param {number}} time 睡眠时间，单位：毫秒
 */
async function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}


module.exports = {
  execCommand,
  log,
  sleep
};
