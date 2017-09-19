import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles';

import mui from './mui';
import App from './components/App';

import { Release } from './models';

export default function launching() {
  return async (req, res, error) => {
    const context = {};

    const muiTheme = getMuiTheme(mui, {
      userAgent: req.get('user-agent'),
    });

    const releases = await Release.findAll({
      order: [['date', 'DESC']],
      limit: 20,
    });

    const html = renderToString(
      <StaticRouter location={req.url} context={context}>
        <MuiThemeProvider muiTheme={muiTheme}>
          <App releases={releases.map(item => item.toJSON())} />
        </MuiThemeProvider>
      </StaticRouter>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.render('index', { html, releases });
    }
  };
}
