const inquirer = require('inquirer')
const quetions = [
  {
    type : "input",
    name : "sender.email",
    message : "Sender's email address - "
  },
  {
    type : "input",
    name : "sender.name",
    message : "Sender's name - "
  },
  {
    type : "input",
    name : "subject",
    message : "Subject - ",
    when: function(input) {
      // console.log(input)
      return true
    },
    validate: async function(input) {
      console.log('asdasdasdaswd')
      return true
    }
  }
]
export default function(options = quetions) {
  return async function(ctx, next) {
    const data = await inquirer.prompt(options)
    Object.assign(ctx.argv.query, data)
    await next();
  }
}