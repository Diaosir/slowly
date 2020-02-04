import Context from '../../../lib/utils/context'
export default function inquire(_?: any) {
  return async function(ctx: Context, next: Function) {
    // const data = inquirer.prompt(questions)
    ctx.query.name = 'test_user'
    await next();
  }
}