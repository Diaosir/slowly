#!/usr/bin/env node
"use strict";
const slowly = require('../../dist/app').default;
process.cwd = function() {
  return '/Users/fengzhihao/Projects/ironman/slowly/test/bin'
}
const app = new slowly()
// app.use(async (ctx, next) => {
//   console.log('1 start')
//   await next();
//   console.log('1 end')
// })
// app.use(async (ctx, next) => {
//   console.log(ctx)
//   await next();
//   console.log('2 end')
// })
// console.log(app)
// var argv = require('yargs').argv;
// console.log(process.execPath)
// console.log(process.argv[1])