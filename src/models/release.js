import {
  DATEONLY,
  STRING,
} from 'sequelize';

import moment from 'moment';

import db from '../db';

export default db.define('release', {

  tag: { type: STRING, notNull: true, notEmpty: true, primaryKey: true },

  date: {
    type: DATEONLY,
    notNull: true,
    get() {
      const value = this.getDataValue('date');
      return moment.utc(value, 'YYYY-MM-DD').toDate();
    },
  },

  chipset: { type: STRING, notNull: true },
  version: { type: STRING, notNull: true },

});
