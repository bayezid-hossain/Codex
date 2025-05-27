import { ItemModel } from "./data-object";

export class EventEmitter<ItemModel> {
    private handlers: ((...args: any[]) => void)[] = [];

    on<T extends keyof ItemModel>(
        event: "FieldChanged",
        handler: <K extends T>(
            field: K,
            newValue: ItemModel[K],
            oldValue: ItemModel[K],
            currentValues: ItemModel,
            row: ItemModel
        ) => void
    ): void {
        this.handlers.push(handler as (...args: any[]) => void);
    }

    triggerFieldChanged<K extends keyof ItemModel>(
        field: K,
        newValue: ItemModel[K],
        oldValue: ItemModel[K],
        currentValues: ItemModel,
        row: ItemModel
    ): void {
        for (const handler of this.handlers) {
            handler(field, newValue, oldValue, currentValues, row);
        }
    }
}

export const dsPersonPushNotifications = new EventEmitter<ItemModel>();
