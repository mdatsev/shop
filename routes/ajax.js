const router = new (require('koa-router'))({ prefix: '/ajax' });
const shop = require('../dbmodels/shop.js');

router.post('/shopLocations', async ctx => {
  const { organizationId } = ctx.request.body;

  ctx.body = await shop.getAllOrg(organizationId);
});

module.exports = router;
