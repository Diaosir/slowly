#!/usr/bin/env node
"use strict";
const { App, Router } = require('../../index');
const path = require('path')
console.log(process.cwd())
const router = new Router()
const app = new App({
  es6: true,
  version: '1.0.0',
  name: 'test-slowly',
  dirname: path.join(process.cwd(), '/test/bin')
});
console.log()
router.register(`init <template>`, 'init the template of project and relate the project to the remote repository')
      .alias('i')
      .usage('init <template> [-q | --quiet] <-a | --action>')
      .option('[-q | --quiet]', 'quiet is required', 'dd')
      .option('<-a | --action>', 'quiet is required', 'dd')
      .option('<-n | --name>', 'name is required', 'dd')
      .action(app.ctx.controller.home.init)
      
router.register('replace <file> [...otherFiles]', app.ctx.controller.home.replace)
router.register('new <template> <name> [-a | --action]', 'init the template of project and relate the project to the remote repository')
router.register('add <template> <name> [-a | --action]', 'init the template of project and relate the project to the remote repository')
router.register('install <template> <name> [-a | --action]', 'init the template of project and relate the project to the remote repository')

app.use(router.routes());

app.ctx.emitter.on('command:help', function(command) {
  // console.log(command)
})
app.ctx.emitter.on('illegality:option', function(command, option) {
  console.log('............')
  console.log('............')
  console.log('............')
  console.log('............')
  console.log('............')
  console.log('............')
  console.log('............')
  // console.log(command)
  console.log(app.ctx.config)
})
