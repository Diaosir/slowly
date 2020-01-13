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
// export { default as Help } from './help'
export default function decorator() {
  return async(ctx: IContext, next: any) => {
    const { app: { router}, controller } = ctx;
    Object.keys(controller).forEach((controllerName) => {
      const { commands }  = controller[controllerName];
      if(is.isObject(commands) && Object.keys(commands).length > 0) {
        for(let commandName in commands) {
          const { usage, options, actions, alias, config = {}, description, before, after} = commands[commandName];
          router.register(commandName === 'index' ? controllerName : `${controllerName} ${commandName}`, usage, config);
          if(is.isArray(options)) {
            options.forEach((option: Array<any>) => {
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
          let fn = commandName === 'index' ? [controller[controllerName].index] : [].concat(actions || []);
          if(before) {
            fn.unshift(before)
          }
          if(after) {
            fn.push(after)
          }
          router.action.apply(router, fn);
        }
      }
    })
    await next();
  }
}