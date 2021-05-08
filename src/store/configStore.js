// import { createStore } from 'redux';
// import { devToolsEnhancer } from 'redux-devtools-extension';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
// import reducer from './bugs';
import reducer from './reducer';
import toast from './middleware/toastify';
import logger from './middleware/logger';
import api from './middleware/api';
// Vanilla Redux implementation
// const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
// store = createStore(reducer, reduxDevTools);
// export default store

// From redux-devtools-extension
// export default createStore(reducer, devToolsEnhancer({ trace: true }));

// Exporting Store as a function
// const configureStore = () => {
//   return createStore(reducer, devToolsEnhancer({ trace: true }));
// };
// export default configureStore;

// Using @redux/toolkit
// <OR>
// const storeAppConfig = ()=>{ // same func as below }
// export default storeAppConfig
export default () => {
  return configureStore({
    reducer,
    middleware: [...getDefaultMiddleware(), logger('Console'), toast, api],
  });
};
