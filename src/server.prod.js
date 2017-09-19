import 'babel-polyfill';

import express from 'express';
import morgan from 'morgan';
import { join } from 'path';

import webpackConfig from '../webpack.prod';

import db from './db';
import launching from './launching';

import assets from '../dist/assets.json';

const ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;

const ASSETS = join(__dirname, '..', 'dist');

(async () => {
  try {

    await db.authenticate();
    await db.sync();

    const app = express();

    app.set('view engine', 'pug');

    app.use(morgan('combined'));

    app.locals.assets = assets;
    app.locals.publicPath = webpackConfig.output.publicPath;
    app.use('/assets', express.static(ASSETS));
    app.get('*', launching());

    app.use((err, req, res, next) => {
      res.status(500).end();
      console.error(req.url, err.stack || err);
    });

    app.listen(PORT, () => {
      console.log('server listen %d in %s', PORT, ENV);
    });
  } catch (e) {
    console.error(e.stack);
  }
})();
