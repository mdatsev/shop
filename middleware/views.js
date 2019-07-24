const views = require('koa-views');

module.exports = (dir) =>
  async (ctx, next) => {
    const originalViews = views(dir, { extension: 'pug' });

    await originalViews(ctx, () => {
      const originalRender = ctx.render.bind(ctx);

      ctx.viewGlobals = {};
      ctx.render = function (relPath, locals = {}) {
        return originalRender(relPath, { ...ctx.viewGlobals, ...locals });
      };
      return next();
    });
  };
