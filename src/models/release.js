import {
  DATEONLY,
  STRING,
} from 'sequelize';

import moment from 'moment';
import { pick, transform } from 'lodash';

import db from '../db';

const Release = db.define('release', {

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

Release.findByFilters = function(filters, options = {}) {
  filters = pick(filters, ['tag', 'chipset', 'version']);
  filters = transform(filters, (result, value, key) => {
    if (value) {
      result.push({
        [key]: { $like: `%${value}%` },
      });
    }
  }, []);

  if (filters.length > 0) {
    options.where = { ...options.where, $and: filters };
  }

  return Release.findAll(options);
}

export default Release;
