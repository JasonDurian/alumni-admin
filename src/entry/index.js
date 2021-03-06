import dva from 'dva';
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'dva/router';
import { message, LocaleProvider } from 'antd';
import { IntlProvider, addLocaleData } from 'react-intl';
import createLoading from 'dva-loading';
import '../index.css';

// 1. Initialize
const app = dva({
  history: browserHistory,
  onError(e) {
    if ((e.number == 101) || (e.number == 103)){
      if (location.pathname !== '/login') {
        let from = location.pathname
        if (location.pathname === '/dashboard') {
          from = '/dashboard'
        }
        window.location = `${location.origin}/login?from=${from}`
      }
    }
    message.error(e.message, /* duration */3);
  },
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('../models/app'))

// 4. Router
app.router(require('../router'));

// 5. Start
const App = app.start();

// 国际化处理
const appLocale = window.appLocale;
addLocaleData(appLocale.data);
ReactDOM.render(
  <LocaleProvider locale={appLocale.antd}>
    <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
      <App />
    </IntlProvider>
  </LocaleProvider>,
  document.getElementById('root')
);

// 6. persist   安全性
// persistStore( app._store, {
//   whitelist: ['member'],
//   storage: asyncSessionStorage,
// });

/*
 * 暂时用此方法在任意位置删除任意state
 purgeStoredState({storage: localStorage}, ['member']).then(() => {
 console.log('purge of memberReducer completed')
 }).catch(() => {
 console.log('purge of memberReducer failed')
 })
 */
