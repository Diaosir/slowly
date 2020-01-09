import Context from './utils/context';
import { IAppOption, IContext } from './interface/type';
import curl from './utils/curl';
declare class App {
    name: string;
    argv: any;
    ctx: IContext;
    config: any;
    cwd: string;
    allCommands: any;
    baseLoad: any;
    middlewares: Array<Function>;
    option: IAppOption;
    curl: typeof curl;
    constructor(option: IAppOption);
    use(fn: Function): this;
    createContext(): Context;
    callback(): void;
    help(): void;
    usage(): void;
    private _getRootParentModule;
}
export default App;
