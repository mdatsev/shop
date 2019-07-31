const session = require('../dbmodels/session.js');
const user = require('../dbmodels/user.js');
const getDefaultExpiration = () =>
  new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000);//= now + approx. 1 year
const getDefaultExpirationShort = () =>
  new Date(new Date().getTime() + 7 * 60 * 60 * 1000);//= now + approx. 7 days

module.exports = {
  authenticateUser () {
    return async (ctx, next) => {
      ctx.auth = {};
      const authUserId = ctx.cookies.get('userId');
      const sessionSecret = ctx.cookies.get('sessionSecret');
      const isVerified = await session.verify({ userId: authUserId, secret: sessionSecret });

      if (authUserId && sessionSecret && isVerified) {
        ctx.auth.userId = authUserId;
        ctx.auth.loggedIn = true;
        ctx.auth.userName = (await user.get(authUserId)).name;
      }

      ctx.auth.login = async (loginUserId, remember) => {
        if (remember) {
          const expirationDate = getDefaultExpiration();
          const sessionSecret = await session.create({
            userId: loginUserId,
            expirationDate,
          });

          ctx.cookies.set('sessionSecret', sessionSecret, { expirationDate });
          ctx.cookies.set('userId', loginUserId, { expirationDate });
        } else {
          const sessionSecret = await session.create({
            userId: loginUserId,
            expirationDate: getDefaultExpirationShort(),
          });

          ctx.cookies.set('sessionSecret', sessionSecret);
          ctx.cookies.set('userId', loginUserId);
        }
      };

      ctx.auth.logout = async () => {
        ctx.cookies.set('sessionSecret', null);
        ctx.cookies.set('userId', null);
        await session.delete({ secret: sessionSecret });
      };

      await next();
    };
  },

  async loggedIn (ctx, next) {
    if (ctx.auth && ctx.auth.loggedIn) {
      await next();
    } else {
      ctx.redirect(`/login?redirect=${encodeURIComponent(ctx.path)}`);
    }
  },
  async notLoggedIn (ctx, next) {
    if (ctx.auth && ctx.auth.loggedIn) {
      ctx.redirect('/');
    } else {
      await next();
    }
  },
};
