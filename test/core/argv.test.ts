import Argv from '../../lib/core/argv'
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
    expect(argv.query).toMatchObject({'n': ['hzz', true], 'ad': 'huangzhen', 'ab': ['hello', "name"]});
    expect(argv.name).toBe('slowly');
    expect(argv.params).toContain('lastname')
  })
})