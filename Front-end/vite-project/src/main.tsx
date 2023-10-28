import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App.tsx';
import store from './Components/store/reducer/store';

ReactDOM.createRoot(document.getElementById("root")!).render(

  <Provider store={store}>
    <App />
  </Provider>

);
