import { IContext } from '../interface/type'
import * as is from '../utils/is'
export { default as Prefix } from './prefix'
export { default as Option } from './Option'
export { default as Usage } from './Usage';
export { default as Alias } from './Alias';
export { default as Description } from './Description'
export { default as Help } from './Help'
export { default as After } from './After'
export { default as Before } from './Before'
export { default as BeforeAll } from './BeforeAll'
export { default as AfterAll } from './AfterAll'

export default function decorator() {
  return async(ctx: IContext, next: any) => {
    const { app: { router }, controller } = ctx;
    Object.keys(controller).forEach((controllerName) => {
      const { commands, beforeAll, afterAll, optionAll }  = controller[controllerName];
      if(is.isObject(commands) && Object.keys(commands).length > 0) {
        for(let commandName in commands) {
          const { usage, options, actions, alias, config = {}, description, before, after} = commands[commandName];
          router.register(commandName === 'index' ? controllerName : `${controllerName} ${commandName}`, usage, config);
          if(is.isArray(options)) {
            options.forEach((option: Array<any>) => {
              router.option.apply(router, option);
            })
          }
          if(is.isArray(optionAll)) {
            optionAll.forEach((option: Array<any>) => {
              router.option.apply(router, option);
            })
          }
          if(alias) {
            router.alias(alias)
          }
          if(usage) {
            router.usage(usage)
          }
          if(description) {
            router.description(description)
          }
          let fn = [controller[controllerName][commandName]].concat(actions || []);
          if(Array.isArray(before)) {
            fn.unshift(...before)
          }
          if(Array.isArray(after)) {
            fn.push(...after)
          }
          if(Array.isArray(beforeAll)) {
            fn.unshift(...beforeAll)
          }
          if(Array.isArray(afterAll)) {
            fn.push(...afterAll)
          }
          router.action.apply(router, fn);
        }
      }
    })
    await next();
  }
}