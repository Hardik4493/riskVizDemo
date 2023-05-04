import { configureStore } from '@reduxjs/toolkit';

import configReducer from './config';

export const store = configureStore( {
    reducer : {
        config : configReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
})