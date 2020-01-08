Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
// import { EventEmitter11: EventEmitter } from '../interface/type'
class EventHandler extends events_1.EventEmitter {
    constructor() {
        super();
    }
}
exports.default = EventHandler;
