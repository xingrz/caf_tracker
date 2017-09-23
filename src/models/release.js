import {
  DATEONLY,
  STRING,
  TEXT,
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

  manifest: {
    type: TEXT,
    get() {
      try {
        return JSON.parse(this.getDataValue('manifest'));
      } catch (e) {
        return null;
      }
    },
    set(value) {
      this.setDataValue('manifest', JSON.stringify(value));
    }
  },

});

Release.findByFilters = function(filters, options = {}) {
  options = {
    attributes: {
      exclude: ['manifest'],
    },
    ...options,
  };

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
