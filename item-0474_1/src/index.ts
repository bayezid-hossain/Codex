import { DataObject, ItemModel } from "./data-object";
import { dsPersonPushNotifications } from "./event-emitter";
dsPersonPushNotifications.on("FieldChanged", (field: string | number, newValue: any, oldValue: any, currentValues: any, row: DataObject) => {
    console.log(row["isPushNotificationEnabled"]);
});
dsPersonPushNotifications.triggerFieldChanged(
    "what's wrong",
    "nothing", "something",
    {} as DataObject,
    { isPushNotificationEnabled: false }
);