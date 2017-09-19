import 'babel-polyfill';

import moment from 'moment';

import db from './db';
import { Release } from './models';

import releases from './utils/releases';

(async () => {
  try {
    console.log('Started');

    await db.authenticate();
    await db.sync();

    console.log('Working...');

    let fetched = await releases();
    console.log(`Fetched ${fetched.length} releases`);

    const latest = await Release.findOne({ order: [['date', 'DESC']] });
    if (latest) {
      console.log(`Existing latest: ${latest.date}`);

      fetched = fetched.filter(release => release.date >= latest.date);
      console.log(`Filtered ${fetched.length} new releases`);
    }

    const records = await Release.bulkCreate(fetched, { ignoreDuplicates: true });
    console.log(`Inserted ${records.length} records`);

    process.exit();
  } catch (e) {
    console.error(e.stack);
    process.exit(-1);
  }
})();
