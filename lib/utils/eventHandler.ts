import { EventEmitter } from "events";
// import { EventEmitter11: EventEmitter } from '../interface/type'

export default class EventHandler extends EventEmitter{
  constructor(...args) {
    super();
  }
}