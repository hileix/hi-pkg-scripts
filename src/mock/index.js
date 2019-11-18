'use strict';

const Koa = require('koa');
const app = new Koa();
const path = require('path');
const fs = require('fs-extra');

const { projectPath } = require('../dev.js');

const Router = require('koa-router');
const router = new Router();

generateRouters(router);

router.get('/', (ctx, next) => {
  ctx.body = { code: 1, message: 'success' };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);

console.log('http://localhost:3000/');

function generateRouters(router) {
  const mockPath = path.resolve(projectPath, 'mock');
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
        router[method](url, (ctx, next) => {
          ctx.body = value;
        });
      }

      if (typeof value === 'function') {
        router[method](url, value);
      }
    }
  });
}
