#!/usr/bin/env node
"use strict";
process.cwd = function() {
  return 'G:\\github\\slowly\\test\\bin'
  // return '/Users/fengzhihao/Projects/github/slowly/test/bin'
}

const { App, Router } = require('../../dist/index');


const router = new Router()
const app = new App({
  es6: true,
  version: '1.0.0'
});

router.register('init <dir> [-q | --quiet] <-a | --action>', {
  optionConfig: {
    
  },
  onHelp: () => {
    console.log('Examples:');
    console.log('  $ asdasd');
    console.log('  $ sasdd -h');
  },
  description: 'ddd'
}, app.ctx.controller.home.init);
app.use(router.routes());