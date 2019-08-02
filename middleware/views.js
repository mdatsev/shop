const views = require('koa-views');

module.exports = (dir, { globals, ...restOpts }) =>
  async (ctx, next) => {
    const originalViews = views(dir, restOpts);

    await originalViews(ctx, () => {
      const originalRender = ctx.render.bind(ctx);

      ctx.viewGlobals = {};
      ctx.render = function (relPath, locals = {}) {
        return originalRender(relPath, { ...globals, ...ctx.viewGlobals, ...locals });
      };
      return next();
    });
  };
