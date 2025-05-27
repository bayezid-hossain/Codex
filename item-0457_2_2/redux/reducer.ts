import { AnyAction, combineReducers } from 'redux';
import { INCREMENT, DECREMENT } from './actions';
import { count } from 'console';

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
    counter: counterReducer, // User data with 10 minutes TTL

});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;