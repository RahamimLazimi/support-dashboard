import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { Provider } from 'react-redux';

import App from './App';
import './i18n';
import { store } from './redux';
import { LanguageProvider, useDirection } from './providers/LanguageProvider'; // נניח שיש hook ל-dir

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

// יצירת cache ל-LTR
const cacheLtr = createCache({
  key: 'mui',
  stylisPlugins: [prefixer],
});

// יצירת cache ל-RTL
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// קומפוננט Wrapper עם cache דינמי לפי direction
function AppWrapper({ children }: { children: React.ReactNode }) {
  const direction = useDirection();

  const cache = direction === 'rtl' ? cacheRtl : cacheLtr;

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <StyledEngineProvider injectFirst>
          <LanguageProvider>
            <AppWrapper>
              <CssBaseline />
              <App />
            </AppWrapper>
          </LanguageProvider>
        </StyledEngineProvider>
      </HashRouter>
    </Provider>
  </React.StrictMode>,
);
