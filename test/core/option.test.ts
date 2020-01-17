import Option from '../../lib/core/option'

describe('option test', () => {
  test('option', async () => {
    const option = new Option('-l, --list <items>', 'comma separated list', [1, 2]);
    // expect(option.name).toBe('list')
    // expect(option.summary_name).toBe('l')
    expect(option.description).toBe('comma separated list')
    expect(option.getLongName()).toBe('list')
    expect(option.getShortName()).toBe('l')
    expect(option.required).toBeTruthy();
    expect(option.name).toBe('items');
    expect(option.defaultValue).toContain(1)
  })
})