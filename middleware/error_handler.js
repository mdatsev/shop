module.exports = () =>
  async (ctx, next) => {
    await next();
    if (ctx.status === 404) {
      await ctx.render('404');
    }
  };
