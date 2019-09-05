#!/usr/bin/env node
"use strict";
process.cwd = function() {
  return 'G:\\github\\slowly\\test\\bin'
}
const { App, Router } = require('../../dist/index');


const router = new Router()
const app = new App();

router.register('init', app.ctx.controller.home.init);
app.use(router.routes());