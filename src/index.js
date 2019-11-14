#!/usr/bin/env node
"use strict";

const program = require("commander");

program
  .command("release")
  .description("Release a new version")
  .action(() => {
    require('./release.js')
  });

program.parse(process.argv);
