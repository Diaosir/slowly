#!/usr/bin/env node
"use strict";
process.cwd = function() {
  // return 'G:\\github\\slowly\\test\\bin'
  return '/Users/fengzhihao/Projects/github/slowly/test/bin'
}

const { App, Router } = require('../../dist/index');


const router = new Router()
const app = new App({
  es6: true,
  version: '1.0.0'
});

router.register('init <dir> [-q | --quiet] <-a | --action>', {
  optionConfig: {
    dir: 'ddd',
    quiet: 'quiet is not required',
    action: 'action is required'
  },
  onHelp: () => {
    console.log('Examples:');
    console.log('  $ asdasd');
    console.log('  $ sasdd -h');
  },
  description: 'init the template of project and relate the project to the remote repository'
}, app.ctx.controller.home.init);
router.register('[-a | --action]', {
  optionConfig: {
    action: "upload files to server"
  }
}, async () => {
  console.log(11)
})
app.use(router.routes());