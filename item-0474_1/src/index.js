"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_emitter_1 = require("./event-emitter");
event_emitter_1.dsPersonPushNotifications.on("FieldChanged", (field, newValue, oldValue, currentValues, row) => {
    console.log(row["isPushNotificationEnabled"]);
});
event_emitter_1.dsPersonPushNotifications.triggerFieldChanged("what's wrong", "nothing", "something", {}, { isPushNotificationEnabled: false });
