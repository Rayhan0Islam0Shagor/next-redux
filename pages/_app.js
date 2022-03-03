import '../styles/globals.css';
import React from 'react';

import { wrapper } from '../redux/store';
import { useStore, Provider } from 'react-redux';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';

const MyApp = ({ Component, pageProps }) => {
  const store = useStore((state) => state);

  return process.browser ? (
    <Provider store={store}>
      <PersistGate persistor={store.__persistor} loading={<div>Loading</div>}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  ) : (
    <Provider store={store}>
      <PersistGate loading={null} persistor={store}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
};

export default wrapper.withRedux(MyApp);
