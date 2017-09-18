import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';

import mui from './mui';
import App from './components/App';

const muiTheme = getMuiTheme(mui);

render(
  <BrowserRouter>
    <MuiThemeProvider muiTheme={muiTheme}>
      <App />
    </MuiThemeProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
