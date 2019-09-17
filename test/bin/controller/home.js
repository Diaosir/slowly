const fs = require('fs');
const path = require('path')
export default class Home {
    async init(ctx) {
        // console.log(ctx)
        const { argv: { query }} = this.ctx;
        // console.log(this.ctx)
        const body = await this.ctx.service.test2.sayHello()
        console.log(query);
    }
    async replace(ctx) {
        const { argv: { query }} = this.ctx;
        const filelist = [query.file, ...query.otherFiles];
        filelist.forEach((file) => {
            const filepath = path.join(process.cwd(), file);
            // console.log(filepath)
            let context = fs.readFileSync(filepath, { encoding: 'utf-8'});
            context = context.replace(/(px2rem\((\d+)\))/g, function(substring, ...args) {
                return substring.replace(args[0], `${args[1]}px`);
            })
            fs.writeFileSync(filepath, context, { encoding: 'utf-8'})
        })
        const cwd = process.cwd();
    }
}