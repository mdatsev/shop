const router = new (require('koa-router'))({ prefix: '/orgs' });
const { loggedIn } = require('../middleware/user_auth.js');
const organization = require('../controllers/organization.js');

router.get('/', loggedIn, async ctx =>
  ctx.render('orgs/index', {
    orgs: await organization.getAllOfUser(ctx.auth.userId),
  })
);

module.exports = router;
