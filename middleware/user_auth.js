const session = require('../controllers/session.js');
const getDefaultExpiration = () =>
  new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000);//= now + approx. 1 year
const getDefaultExpirationShort = () =>
  new Date(new Date().getTime() + 7 * 60 * 60 * 1000);//= now + approx. 7 days

module.exports = {
  async authenticateUser (ctx, next) {
    ctx.auth = {};
    const authUserId = ctx.cookies.get('userId');
    const sessionSecret = ctx.cookies.get('sessionSecret');

    if (authUserId && sessionSecret && session.verify({ userId: authUserId, sessionSecret })) {
      ctx.auth.userId = authUserId;
    }

    ctx.auth.login = async (loginUserId, remember) => {
      if (remember) {
        const expires = getDefaultExpiration();
        const sessionSecret = await session.create({
          userId: loginUserId,
          expirationDate: expires,
        });

        ctx.cookies.set('sessionSecret', sessionSecret, { expires });
        ctx.cookies.set('userId', loginUserId, { expires });
      } else {
        const sessionSecret = await session.create({
          userId: loginUserId,
          expirationDate: getDefaultExpirationShort(),
        });

        ctx.cookies.set('sessionSecret', sessionSecret);
        ctx.cookies.set('userId', loginUserId);
      }
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
