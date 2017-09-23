import { Router } from 'express';

import { Release } from '../models';

export default function () {

  const router = new Router();

  router.get('/', async (req, res, error) => {
    try {
      const releases = await Release.findByFilters(req.query, {
        order: [['date', 'DESC']],
        limit: 200,
      });

      res.json({
        releases,
        query: req.query,
      });
    } catch (e) {
      error(e);
    }
  });

  return router;

}
