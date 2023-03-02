import { applyMiddleware, createStore } from 'redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistReducer } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'

import {name as appName} from './../../app.json'

import reducers from './reducers'

const persistConfig = {
    key: appName,
    storage: AsyncStorage,
    blacklist: [
        '',
    ]
}
const persistedReducer = persistReducer(persistConfig, reducers)
export const sagaMiddleware = createSagaMiddleware()
export const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware))
