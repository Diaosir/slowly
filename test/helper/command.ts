export default function commandHelper(command: string) {
  if(typeof command !== 'string') {
    return;
  }
  process.argv = ['node'].concat(command.split(/\s+/));
  process.execPath = '/Users/huangzhen/.nvm/versions/node/v8.4.0/bin/node';
}