import { Service } from '../../lib'
export default class Gitlab extends Service {
  init() {
    console.log(this.ctx.services)
  }
}