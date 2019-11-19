'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const { projectPath, pkg } = require('../dev.js');
const proxy = require('http-proxy-middleware');
const pino = require('express-pino-logger')();

const app = express();
const mockPath = path.resolve(projectPath, 'mock');

const port =
  (pkg['hi-pkg-scripts'] &&
    pkg['hi-pkg-scripts'].mock &&
    pkg['hi-pkg-scripts'].mock.port) ||
  3006;

const proxyTarget =
  (pkg['hi-pkg-scripts'] &&
    pkg['hi-pkg-scripts'].mock &&
    pkg['hi-pkg-scripts'].mock.proxy) ||
  '';

app.use(pino);

generateRouters(app);

// 配置了 proxy

if (proxyTarget) {
  app.use(
    '*',
    proxy({
      target: proxyTarget,
      changeOrigin: true
    })
  );
} else {
  // 未配置 proxy，并且未 mock data，则返回错误信息
  app.use('*', (req, res) => {
    res.json({ code: -1, message: 'Mock data is not provided!' });
  });
}

app.listen(port);

console.log(
  `The mock service is listening on port ${port}! -> http://localhost:${port}/`
);

function generateRouters(app) {
  if (!fs.existsSync(mockPath)) {
    console.error('mock 文件夹不存在！');
    process.exit(1);
  }
  const files = fs.readdirSync(mockPath);
  files.forEach(file => {
    const fileObj = require(`${mockPath}/${file}`);

    for (let key in fileObj) {
      const arr = key.split(' ');
      const method = arr[0].toLowerCase();
      const url = arr[1];
      const value = fileObj[key];

      if (typeof value === 'object') {
        app[method](url, (req, res) => {
          res.json(value);
        });
      }

      if (typeof value === 'function') {
        app[method](url, value);
      }
    }
  });
}
