import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
//@ts-ignore
import expireTransform from 'redux-persist-transform-expire';
import rootReducer, { RootState } from './reducer';
import { createStore } from 'redux';

// Create the expire transform with your desired TTL
const expireIn = 10 * 1000; // 24 hours in milliseconds
const expirationKey = 'expiresAt';

const persistConfig = {
    key: 'counter',
    storage,
    transforms: [
        expireTransform({
            expireKey: 'counter',
            defaultState: { count: 0 }, // your default state when expired
            expireSeconds: 10, // convert ms to seconds
        }),
    ],
    // Other configuration options if needed
    // whitelist: ['user', 'auth'],
};



const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

// Create store with persisted reducer
export const store = createStore(
    persistedReducer,
    // Add any middleware or enhancers here
);

export const persistor = persistStore(store);