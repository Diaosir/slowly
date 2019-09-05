
import * as is from '../utils/is'
import { CommandOptionsInterface } from '../interface/command'
export default function Command(...commandOptions) {
  const [ route, description, config] = commandOptions;
  const { option, ...resetConfig } = config;
  return function(target, name?: string, descriptor?) {
    if (!is.isFunction(descriptor.value)) {
      return;
    }
    if (!is.isObject(target.commands)) {
      target.commands = {}
    }
    target.commands[name] = {
      route,
      description,
      config: resetConfig,
      option: option,
      action: function(...actionsArgs) {
        descriptor.value.apply(this, actionsArgs)
      }
    }
  }
}