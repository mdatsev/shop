const router = new (require('koa-router'))();
const { loggedIn, notLoggedIn } = require('../middleware/user_auth.js');
const user = require('../controllers/user.js');

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

router.get('/register', notLoggedIn, ctx => ctx.render('register'));
router.post('/register', notLoggedIn, async ctx => {
  const { name, email, password } = ctx.request.body;

  await user.create({ name, email, password });
});

router.get('/me', loggedIn, ctx => {
  ctx.body = `hello ${ctx.auth.userId}`;
});

module.exports = router;
