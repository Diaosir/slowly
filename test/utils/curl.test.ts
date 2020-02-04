import curl from '../../lib/utils/curl'
describe('curl test', () => {
  test('curl with callback', done => {
    curl('https://www.baidu.com/', () => {
      done()
    }, {});
  })
  test('curl with promise', async () => {
    const result = await curl('https://www.baidu.com/');
    expect(result.status).toBe(200)
  })
})