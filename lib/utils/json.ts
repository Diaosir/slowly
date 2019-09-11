var prettyjson = require('prettyjson');
export default class Json {
  public data: {
    [key: string]: any;
  }
  constructor(json) {
    this.data = json;
  }
  output() {
    // const string = JSON.stringify(this.data);
    // function createString(json) {

    // }
    var data = {
      username: 'rafeca',
      url: 'https://github.com/rafeca',
      twitter_account: 'https://twitter.com/rafeca',
      projects: ['prettyprint', 'connfu', { 'name': 'dd'}, 0,]
    };
    console.log(prettyjson.render(data, {
      noColor: false
    }));
    // console.log(this.data);
  }
}