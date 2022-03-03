import {
  createStore,
  applyMiddleware,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import thunkMiddleware from 'redux-thunk';
import storage from './config_store';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'reduxjs-toolkit-persist';

import postReducer from './reducers/fetchReducer';

//COMBINING ALL REDUCERS
const combinedReducer = combineReducers({
  posts: postReducer,
});

// BINDING MIDDLEWARE
const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const makeStore = ({ isServer }) => {
  if (isServer) {
    return createStore(combinedReducer, bindMiddleware([thunkMiddleware]));
  } else {
    const {
      persistStore,
      persistReducer,
      FLUSH,
      REHYDRATE,
      PURGE,
      REGISTER,
    } = require('reduxjs-toolkit-persist');

    const persistConfig = {
      key: 'root',
      whitelist: ['posts'],
      storage,
    };

    const persistedReducer = persistReducer(persistConfig, combinedReducer); // Create a new reducer with our existing reducer

    // const store = createStore(
    //   persistedReducer,
    //   bindMiddleware([thunkMiddleware])
    // );

    const store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) => {
        const middleWares = getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
          immutableCheck: false,
          isSerializable: false,
        });
        return middleWares;
      },
    });

    store.__persistor = persistStore(store);

    return store;
  }
};

export const wrapper = createWrapper(makeStore);

// // BLACKLIST
// const persistConfig = {
//     key: 'root',
//     storage: storage,
//     blacklist: ['navigation'] // navigation will not be persisted
//   };

//   // WHITELIST
//   const persistConfig = {
//     key: 'root',
//     storage: storage,
//     whitelist: ['navigation'] // only navigation will be persisted
//   };

// const rootPersistConfig = {
//     key: 'root',
//     storage: storage,
//     blacklist: ['auth']
//   }

//   const authPersistConfig = {
//     key: 'auth',
//     storage: storage,
//     blacklist: ['somethingTemporary']
//   }

// const rootReducer = combineReducers({
//   auth: persistReducer(authPersistConfig, authReducer),
//   other: otherReducer,
// });

// export default persistReducer(rootPersistConfig, rootReducer);
