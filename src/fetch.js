import 'babel-polyfill';

import moment from 'moment';

import db from './db';
import { Release } from './models';

import releases from './utils/releases';
import manifest from './utils/manifest';

(async () => {
  try {
    console.log('Started');

    await db.authenticate();
    await db.sync();

    console.log('Working...');

    let fetched = await releases();
    console.log(`Fetched ${fetched.length} releases`);

    if (!process.argv.includes('--all')) {
      const latest = await Release.findOne({ order: [['date', 'DESC']] });
      if (latest) {
        console.log(`Existing latest: ${latest.date}`);

        fetched = fetched.filter(release => release.date >= latest.date);
        console.log(`Filtered ${fetched.length} new releases`);
      }
    }

    for (var i = 0; i < fetched.length; i++) {
      const item = fetched[i];

      try {
        item.manifest = await manifest(item.tag);
        console.log(`[${i + 1}/${fetched.length}] Fetched manifest with ` +
          `${item.manifest.length} projects for ${item.tag}`);
      } catch (e) {
        console.log(`[${i + 1}/${fetched.length}] Skipped empty tag ${item.tag}`);
        continue;
      }

      await Release.upsert(item);
      console.log(`[${i + 1}/${fetched.length}] Upserted tag ${item.tag}`);
    }

    process.exit();
  } catch (e) {
    console.error(e.stack);
    process.exit(-1);
  }
})();
