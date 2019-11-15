#!/usr/bin/env node
"use strict";

const program = require("commander");

program
  .command("release [branchName]")
  .description("Release a new version")
  .action((branchName) => {
    require('./release.js')(branchName)
  });

program.parse(process.argv);
