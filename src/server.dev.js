import 'babel-polyfill';

import express from 'express';
import morgan from 'morgan';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackAssetsMiddleware from 'flying-assets-webpack-plugin/middleware';
import webpackConfig from '../webpack.dev';

import launching from './launching';

const ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;

(async () => {
  try {

    const app = express();

    app.set('view engine', 'pug');

    app.use(morgan('dev'));

    const compiler = webpack(webpackConfig);
    const publicPath = webpackConfig.output.publicPath;

    app.use(webpackDevMiddleware(compiler, {
      publicPath,
      hot: true,
      stats: {
        colors: true
      }
    }));
    app.use(webpackHotMiddleware(compiler));
    app.use(webpackAssetsMiddleware(compiler, { render: false }));
    app.get('*', launching());

    app.use((err, req, res, next) => {
      res.status(500).type('text/plain').send(err.stack || err);
    });

    app.listen(PORT, () => {
      console.log('server listen %d in %s', PORT, ENV);
    });
  } catch (e) {
    console.error(e.stack);
  }
})();
