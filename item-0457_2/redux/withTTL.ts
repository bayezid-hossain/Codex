import moment from 'moment'; // Optional

interface StateWithTTL<T> {
    data: T;
    _persisted_at?: number;
}

const withTTL = <S>(reducer: (state: S | undefined, action: any) => S, ttlMs: number) => {
    const initialState: StateWithTTL<S> = {
        data: reducer(undefined, { type: '__INIT__' }), // Get initial state from wrapped reducer
        _persisted_at: undefined,
    };
    console.log(initialState)
    return (state: StateWithTTL<S> = initialState, action: any): StateWithTTL<S> => {
        if (action.type === 'persist/REHYDRATE' && action.payload && state && action.payload[action.key] && action.payload[action.key]._persisted_at) {
            const now = Date.now();
            const persistedAt = action.payload[action.key]._persisted_at;
            if (now - persistedAt > ttlMs) {
                console.log(initialState)
                // Data is stale, return initial state
                return initialState;
            }
            // Data is fresh, load it
            return { ...action.payload[action.key] };
        }

        const newData = reducer(state.data, action);

        if (newData !== state.data) {
            return { data: newData, _persisted_at: Date.now() };
        }

        return state;
    };
};

export default withTTL;