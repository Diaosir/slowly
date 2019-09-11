import Json from '../lib/utils/json'
describe('json test', function() {
  test("json output", function() {
    const object = new Json({
      'huangzhen': "ddd",
      'a': {
        'name': "d"
      }
    })
    object.output();
  })
})