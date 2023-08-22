//import reducer from './reducer';
//import { legacy_createStore as createStore, applyMiddleware, compose } from 'redux';
//import  thunkMiddleware from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import appReducer from './appSlice';

const store = configureStore({
  reducer: {
    users: usersReducer,
    app: appReducer,
  },
  // middleware of the redux devtools
  devTools: true
});

// const composeEnhacers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = createStore(reducer, composeEnhacers(applyMiddleware(thunkMiddleware)));

export default store;