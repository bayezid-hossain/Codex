// redux/actions.ts

export const INCREMENT = 'INCREMENT' as const;
export const DECREMENT = 'DECREMENT' as const;
export const UPDATE_PERSISTED_TIMESTAMP = 'UPDATE_PERSISTED_TIMESTAMP' as const;

// Action creators (optional)
export const increment = () => ({ type: INCREMENT });
export const decrement = () => ({ type: DECREMENT });
export const updatePersistedTimestamp = () => ({ type: UPDATE_PERSISTED_TIMESTAMP });

// Action types
export type CounterAction =
    | { type: typeof INCREMENT }
    | { type: typeof DECREMENT };

export type PersistedAction =
    | { type: typeof UPDATE_PERSISTED_TIMESTAMP };

// Unified root action type
export type RootAction = CounterAction | PersistedAction;
