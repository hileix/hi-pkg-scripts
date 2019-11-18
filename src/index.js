#!/usr/bin/env node
'use strict';

const program = require('commander');

program
  .command('release [branchName]')
  .description('Release a new version')
  .action(branchName => {
    require('./release/index.js')(branchName);
  });

program
  .command('mock')
  .description('Open mock services')
  .action(() => {
    require('./mock/index.js');
  });

program.parse(process.argv);
