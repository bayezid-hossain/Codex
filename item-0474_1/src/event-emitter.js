"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dsPersonPushNotifications = exports.EventEmitter = void 0;
class EventEmitter {
    constructor() {
        this.handlers = [];
    }
    on(event, handler) {
        this.handlers.push(handler);
    }
    triggerFieldChanged(field, newValue, oldValue, currentValues, row) {
        for (const handler of this.handlers) {
            handler(field, newValue, oldValue, currentValues, row);
        }
    }
}
exports.EventEmitter = EventEmitter;
exports.dsPersonPushNotifications = new EventEmitter();
