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
  version: '1.0.0',
  name: 'test-slowly'
});

router.register('init <template> [-q | --quiet] <-a | --action>', {
  optionConfig: {
    template: 'ddd',
    quiet: 'quiet is not required',
    action: 'action is required'
  },
  description: 'init the template of project and relate the project to the remote repository',
}, app.ctx.controller.home.init);

router.register('[-a | --action]', {
  optionConfig: {
    action: "upload files to server"
  }
})
router.register('new [-a | --action]', {
  optionConfig: {
    action: "upload files to server"
  },
  description: 'init the template of project and relate the project to the remote repository',
})
app.use(router.routes());

app.ctx.emitter.on('')