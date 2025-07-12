import { configureStore,combineReducers } from '@reduxjs/toolkit'

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

import storage from 'redux-persist/lib/storage';

//slice file import
import AdminLoginSlice from './adminSlice';
import UserLoginSlice from './userSlice';

const persistConfig = {
  key: 'logindata',
  version: 1,
  storage,
}
const Rootreducer = combineReducers({
  AdminLogin: AdminLoginSlice,
  UserLogin: UserLoginSlice,
})

const persistedReducer = persistReducer(persistConfig,Rootreducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store)