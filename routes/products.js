const router = new (require('koa-router'))({ prefix: '/products' });

const product = require('../dbmodels/product.js');
const spec = require('../dbmodels/spec.js')

router.get('/:id/show', async ctx => {
  const prod = await product.get(ctx.params.id);

  const specs = await spec.get(prod);

  await ctx.render('products/show', { ...prod, specs });
});

module.exports = router;
