import { combineReducers, AnyAction } from 'redux';
import { INCREMENT, DECREMENT, UPDATE_PERSISTED_TIMESTAMP } from './actions';
import withTTL from './withTTL';
export interface CounterState {
    count: number;
}

const initialCounterState: CounterState = { count: 0 };

const counterReducer = (
    state = initialCounterState,
    action: AnyAction
): CounterState => {
    switch (action.type) {
        case INCREMENT: return { count: state.count + 1 };
        case DECREMENT: return { count: state.count - 1 };
        default: return state;
    }
};


const rootReducer = combineReducers({
    counter: withTTL(counterReducer, 10 * 1000)
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
