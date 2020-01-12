import { IContext } from '../interface/type'
import * as is from '../utils/is'
export { default as Prefix } from './prefix'
export { default as Option } from './Option'
export { default as Usage } from './Usage';
export { default as Alias } from './Alias'
// export { default as Help } from './help'
export default function decorator() {
  return async(ctx: IContext, next: any) => {
    const { app: { router}, controller } = ctx;
    Object.keys(controller).forEach((controllerName) => {
      const { commands }  = controller[controllerName];
      if(is.isObject(commands) && Object.keys(commands).length > 0) {
        for(let commandName in commands) {
          const { usage, options, actions, alias } = commands[commandName];
          router.register(commandName === 'index' ? controllerName : `${controllerName} ${commandName}`, usage);
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
          if(commandName === 'index') {
            router.action.apply(router, [controller[controllerName].index]);
          } else if(Array.isArray(actions) && actions.length > 0) {
            router.action.apply(router, actions);
          }
        }
      }
    })
    await next();
  }
}