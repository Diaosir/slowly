import Argv from '../../lib/core/argv'
const minimist = require('minimist');
describe('argv test', () => {
  test('argv no options', () => {
    process.argv[1] = '/Users/huangzhen/.nvm/versions/node/v8.4.0/bin/slowly'
    process.execPath = '/Users/huangzhen/.nvm/versions/node/v8.4.0/bin/node'
    const argv = new Argv();
    expect(argv.params).toMatchObject({});
    expect(argv.name).toBe('slowly');
  })
  test('argv with options', () => {
    const argv = new Argv(['node', 'slowly', 'init', '-n', 'hzz', '-n', '--ad=huangzhen', '--ab=hello', 'lastname', '--ab', 'name']);
    expect(argv.query).toMatchObject({'n': ['hzz', true], 'ad': 'huangzhen', 'ab': ['hello', true]});
    expect(argv.name).toBe('slowly');
    expect(argv.params).toContain('name')
    expect(argv.params).toContain('lastname')
  })
  test('array options', () => {
    const argv = new Argv(['node', 'slowly', 'init', '-v', 'value1,value2,value3']);
    expect(argv.query).toMatchObject({v: [ 'value1', 'value2', 'value3' ]});
  })
  test('minimist', () => {
    console.log(minimist(['init', '-n', 'hzz', '-nbcss', '--ad=huangzhen', '--ab=hello', 'lastname', '--ab', 'name']))
  })
})