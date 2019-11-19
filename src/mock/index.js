'use strict';

const path = require('path');
const fs = require('fs-extra');
const { projectPath, pkg } = require('../dev.js');
const { spawn } = require('child_process');
const chalk = require('chalk');
const mockPath = path.resolve(projectPath, 'mock');
const notifier = require('node-notifier');

let hasNotifier =
  pkg['hi-pkg-scripts'] &&
  pkg['hi-pkg-scripts'].mock &&
  pkg['hi-pkg-scripts'].mock.notifier;

if (typeof hasNotifier !== 'boolean') {
  hasNotifier = true;
}

let subProcess = null;

startProcess();

function startProcess(isRestart = false) {
  // 开启 mock 服务
  subProcess = spawn('node', [`${path.resolve(__dirname, 'app.js')}`]);

  if (hasNotifier) {
    if (isRestart) {
      notifier.notify({
        title: 'Mock service',
        message: 'Restart mock service successful!'
      });
    } else {
      notifier.notify({
        title: 'Mock service',
        message: 'Mock service started successfully!'
      });
    }
  }

  // 打印输出到控制台
  subProcess.stdout.on('data', data => {
    const s = data.toString();
    let obj,
      hasError = false;
    try {
      obj = JSON.parse(s);
    } catch (err) {
      hasError = true;
    }
    if (hasError) {
      console.log(chalk.green(s));
    } else {
      console.log(chalk.green(JSON.stringify(obj, null, 2)));
    }
  });
  subProcess.stderr.on('data', data => {
    const s = data.toString();
    let obj,
      hasError = false;
    try {
      obj = JSON.parse(s);
    } catch (err) {
      hasError = true;
    }
    if (hasError) {
      console.log(chalk.red(s));
    } else {
      console.log(chalk.red(JSON.stringify(obj, null, 2)));
    }
  });

  // kill 子进程
  process.on('SIGINT', () => {
    if (hasNotifier) {
      notifier.notify({
        title: 'Mock service',
        message: 'Mock service exits.'
      });
    }

    subProcess.kill('SIGKILL');
    process.exit(1);
  });
}

function restartProcess() {
  console.log('Restart mock service...');
  if (subProcess !== null) {
    try {
      subProcess.kill('SIGKILL');
    } catch (err) {
      console.log('restartProcess: ' + err.message);
    }
  }
  startProcess(true);
}

fs.watch(mockPath, (event, filename) => {
  restartProcess();
});
