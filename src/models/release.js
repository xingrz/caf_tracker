import {
  DATEONLY,
  STRING,
} from 'sequelize';

import db from '../db';

export default db.define('release', {

  tag: { type: STRING, notNull: true, notEmpty: true, primaryKey: true },

  date: { type: DATEONLY, notNull: true },
  chipset: { type: STRING, notNull: true },
  version: { type: STRING, notNull: true },

});
