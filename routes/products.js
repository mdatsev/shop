const router = new (require('koa-router'))({ prefix: '/products' });

const product = require('../dbmodels/product.js');

router.get('/:id/show', async ctx => {
  await ctx.render('products/show', await product.get(ctx.params.id));
});

module.exports = router;
