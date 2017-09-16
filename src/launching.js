import React from 'react';
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';

import mui from './mui';
import App from './components/App';

export default function launching() {
  return (req, res, error) => {
    const context = {};

    const muiTheme = getMuiTheme(mui, {
      userAgent: req.get('user-agent'),
    });

    const html = renderToString(
      <StaticRouter location={req.url} context={context}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <App />
        </MuiThemeProvider>
      </StaticRouter>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.render('index', { html });
    }
  };
}
