const router = new (require('koa-router'))();
const user = require('../controllers/user.js');

router.get('/login', (ctx, next) => ctx.render('login'));

router.post('/login', async (ctx, next) => {
  const { email, password, remember } = ctx.request.body;

  ctx.body = await user.login({ email, password });
});

router.get('/register', (ctx, next) => ctx.render('register'));

router.post('/register', async (ctx, next) => {
  const { name, email, password } = ctx.request.body;

  await user.create({ name, email, password });
});

module.exports = router;
