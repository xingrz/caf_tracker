import { Router } from 'express';

import releases from './releases';

export default function () {

  const router = new Router();

  router.use('/api/releases', releases());

  return router;

}
