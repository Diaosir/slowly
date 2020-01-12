
export default function Prefix(prefix: string) {
  return function(target: any, name?: string) {
    if(!!name) {
      return;
    }
    target.prototype['commandPrefix'] = prefix
  }
}
