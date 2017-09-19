import { Router } from 'express';
import { pick, transform } from 'lodash';

import { Release } from '../models';

export default function () {

  const router = new Router();

  router.get('/', async (req, res, error) => {
    const query = {
      tag: '',
      chipset: '',
      version: '',
      ...pick(req.query, ['tag', 'chipset', 'version']),
    };

    const options = {
      order: [['date', 'DESC']],
      limit: 200,
    };

    const filters = transform(query, (result, value, key) => {
      if (value) {
        result.push({
          [key]: { $like: `%${value}%` },
        });
      }
    }, []);

    if (filters.length > 0) {
      options.where = { $and: filters };
    }

    const releases = await Release.findAll(options);

    res.json({
      releases,
      query,
    });
  });

  return router;

}
