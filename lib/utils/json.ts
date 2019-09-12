var prettyjson = require('prettyjson');
export default class Json {
  public data: {
    [key: string]: any;
  }
  constructor(json) {
    this.data = json;
  }
  public static render(json) {
    // const string = JSON.stringify(this.data);
    // function createString(json) {

    //
    console.log(prettyjson.render(json, {
      noColor: false
    }));
    // console.log(this.data);
  }
}