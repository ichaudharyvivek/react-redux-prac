import React from 'react';
import Bugs from './components/Bugs';
import configStore from './store/configStore';
import { Provider } from 'react-redux';

const store = configStore();

const App = () => {
  return (
    <Provider store={store}>
      <Bugs />
    </Provider>
  );
};

export default App;
