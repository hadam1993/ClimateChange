import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';
import { Provider } from 'react-redux';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function configureStore () {
  return createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk))
  );
}

ReactDOM.render(
  <Provider store={configureStore()}>
    <App />
  </Provider>, document.getElementById('root'));
