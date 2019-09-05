import { Command, Decorator} from '../../lib'

export default class Init extends Command {
    constructor(ctx) {
        super(ctx);
    }
    @Decorator.Command('init', 'this is init', {
        option: [
            ['-r, --recursive', 'Remove recursively']
        ]
    })
    @Decorator.Help(function() {
        console.log(this.ctx.argv)
    })
    async init({params, query}) {
        this.ctx.services.gitlab.init();
    }
    @Decorator.Command('upload', 'this is upload', {
        option: [
            ['-r, --recursive', 'Remove recursively']
        ]
    })
    @Decorator.Help(function() {
        console.log(this.ctx.argv)
    })
    async upload() {
        console.log('second')
    }
}