
export default class Command {
  public commands: Array<string>;
  public options: Array<string>;
  public onHelp: Function;
  public ctx: any;
  constructor(ctx) {
    // console.log(this)
    // console.log(this.commands)
    // console.log(this.onHelp())
  }
}