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
router.register(`init <template>`, 'init the template of project and relate the project to the remote repository')
      .alias('i')
      .usage('init <template> [-q | --quiet] <-a | --action>')
      .option('[-q | --quiet]', 'quiet is required', 'dd')
      .option('<-a | --action>', 'quiet is required', 'dd')
      .option('<-n | --name>', 'name is required', 'dd')
      .action(app.ctx.middleware.inquirer(), app.ctx.controller.home.init)
      
router.register('[-b | --blue] <-a | --add>', async (ctx, next) => {
  console.log(ctx.argv.query)
})
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
})
