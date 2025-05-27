import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers, createStore } from 'redux';
import rootReducer from './rootReducer';
import persistStore from 'redux-persist/es/persistStore';




const persistConfig = {
    key: 'root',
    storage,
    version: 1,
    // No need for custom transforms in this case
    whitelist: ['counter'],

};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;