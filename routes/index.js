const assert = require('../utils/assert');
const _ = require('lodash');

const router = new (require('koa-router'))();
const { notLoggedIn } = require('../middleware/user_auth.js');
const user = require('../dbmodels/user.js');
const item = require('../dbmodels/item.js');

const product = require('../dbmodels/product.js');

router.get('/login', notLoggedIn, ctx => ctx.render('login'));
router.post('/login', notLoggedIn, async ctx => {
  const { email, password, remember } = ctx.request.body;

  const userId = await user.login({ email, password });

  if (userId !== null) {
    await ctx.auth.login(userId, remember);
    ctx.redirect(ctx.query.redirect || '/');
  } else {
    ctx.body = 'INVALID LOGIN';
  }
});

router.post('/logout', async ctx => {
  await ctx.auth.logout();
  ctx.redirect('/');
});

router.get('/register', notLoggedIn, ctx => ctx.render('register'));
router.post('/register', notLoggedIn, async ctx => {
  const { name, email, password } = ctx.request.body;

  await user.create({ name, email, password });
  ctx.redirect('/');
});

router.get('/basket', async ctx => {
  const items = JSON.parse(ctx.query.items);
  const products = [];
  const total = { price: 0 };

  for (const { type, id, basketId } of items) {
    if (type === 'product') {
      const prod = await product.get(id);

      if (!prod) continue;

      prod.basketId = basketId;
      total.price += +prod.price;
      products.push(prod);
    }
  }
  await ctx.render('basket', { products, total });
});

router.get('/', async ctx => {
  const {
    pageNum = '1',
    perPage = '15',
    sort = 'created_at',
    ascOrDesc = 'desc',
    showProducts = '1',
    showSubscriptions = '1',
    specName,
    specValue,
    minPriceUSD = '0.00',
    maxPriceUSD = ((await item.getMaxPrice()) / 100 + 1).toFixed(2),
  } = ctx.query;

  assert.user(_.isFinite(+minPriceUSD), 'Invalid min price');
  assert.user(_.isFinite(+maxPriceUSD), 'Invalid max price');

  const pageIndex = pageNum - 1; // 0 indexed
  const limit = +perPage;
  const offset = pageIndex * limit;
  const order = sort; // todo assert ['created_at', 'price', 'name', 'popularity_score'].includes(sort)
  const ascending = ascOrDesc === 'asc';
  const types = [];

  const minPrice = +minPriceUSD * 100;
  const maxPrice = +maxPriceUSD * 100;

  if (+showProducts) {
    types.push('product');
  }

  if (+showSubscriptions) {
    types.push('subscription');
  }

  console.log(types);

  const items = await item.getAll({
    limit,
    offset,
    order,
    ascending,
    filter: { specName, specValue, minPrice, maxPrice, types },
  });

  const pages = [...Array(11).keys()] // number of displayed page buttons
    .map(i => pageIndex + i - Math.min(5, pageIndex) + 1); // center on current but no negative

  await ctx.render('index', {
    items,
    pages,
    pageNum,
    perPage,
    sort,
    ascOrDesc,
    showProducts,
    showSubscriptions,
    specName,
    specValue,
    minPriceUSD,
    maxPriceUSD,
  });
});

module.exports = router;
