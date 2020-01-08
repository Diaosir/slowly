export default class Command {
    commands: Array<string>;
    options: Array<string>;
    onHelp: Function;
    ctx: any;
    constructor();
}
