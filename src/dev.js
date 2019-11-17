"use strict";

const path = require('path');
const projectPath = path.resolve(process.cwd());
const pkg = require(projectPath + '/package.json');

module.exports = {
  projectPath,
  pkg
}
