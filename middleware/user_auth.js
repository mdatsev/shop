const session = require('../controllers/session.js');

module.exports = {
  async authenticateUser (ctx, next) {
    ctx.auth = {};
    const authUserId = ctx.cookies.get('userId');
    const sessionSecret = ctx.cookies.get('sessionSecret');

    if (authUserId && sessionSecret && session.verify({ userId: authUserId, sessionSecret })) {
      ctx.auth.userId = authUserId;
    }

    ctx.auth.login = async loginUserId => {
      const sessionSecret = await session.create({ userId: loginUserId });

      ctx.cookies.set('sessionSecret', sessionSecret);
      ctx.cookies.set('userId', loginUserId);
    };

    await next();
  },
  async loggedIn (ctx, next) {
    if (ctx.auth && ctx.auth.userId !== undefined) {
      await next();
    } else {
      ctx.redirect(`/login?redirect=${encodeURIComponent(ctx.path)}`);
    }
  },
  async notLoggedIn (ctx, next) {
    if (ctx.auth && ctx.auth.userId !== undefined) {
      ctx.redirect('/');
    } else {
      await next();
    }
  },
};
