import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';

import mui from './mui';

import App from './components/App';
import Releases from './components/Releases';

const muiTheme = getMuiTheme(mui);

render(
  <BrowserRouter>
    <MuiThemeProvider muiTheme={muiTheme}>
      <App>
        <Releases />
      </App>
    </MuiThemeProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
