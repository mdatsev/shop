const { SystemError, PeerError, UserError } = require('../utils/assert.js');

module.exports = () =>
  async (ctx, next) => {
    const renderError = (message = 'Internal error') => ctx.render('error', { message });
    const logError = err => console.log(err);

    try {
      await next();
      if (ctx.status === 404) {
        await ctx.render('404');
      }
    } catch (err) {
      if (err instanceof UserError) {
        return renderError(err.message);
      }

      if (err instanceof PeerError) {
        logError(err);
        return renderError();
      }

      if (err instanceof SystemError) {
        logError(err);
        await renderError();
      }

      // Unexpected non-assert error
      logError(err);
      await renderError();
    }
  };
