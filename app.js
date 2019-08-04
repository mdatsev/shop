const path = require('path');
const Koa = require('koa');
const logger = require('koa-logger');
const bodyparser = require('koa-bodyparser');
const koastatic = require('koa-static');

const views = require('./middleware/views.js');
const errorHandler = require('./middleware/error_handler.js');
const { authenticateUser } = require('./middleware/user_auth.js');

const apiRoutes = require('./routes/api.js');
const indexRoutes = require('./routes/index.js');
const organizationsRoutes = require('./routes/organizations.js');
const productsRoutes = require('./routes/products.js');
const subscriptionsRoutes = require('./routes/subscriptions.js');
const ajaxRoutes = require('./routes/ajax.js');

const viewUtils = require('./utils/viewUtils.js');

const app = new Koa()
  .use(logger())
  .use(errorHandler())
  .use(apiRoutes.routes(), apiRoutes.allowedMethods())
  .use(koastatic(path.join(__dirname, 'public')))
  .use(views(path.join(__dirname, 'views'), {
    extension: 'pug',
    globals: {
      ...viewUtils,
    },
  }))
  .use(authenticateUser())
  .use(async (ctx, next) => {
    ctx.viewGlobals.loggedIn = ctx.auth.loggedIn;
    ctx.viewGlobals.userName = ctx.auth.userName;
    await next();
  })
  .use(bodyparser({ enableTypes: ['json', 'form'] }))
  .use(indexRoutes.routes(), indexRoutes.allowedMethods())
  .use(organizationsRoutes.routes(), organizationsRoutes.allowedMethods())
  .use(productsRoutes.routes(), productsRoutes.allowedMethods())
  .use(subscriptionsRoutes.routes(), subscriptionsRoutes.allowedMethods())
  .use(ajaxRoutes.routes(), ajaxRoutes.allowedMethods())
  .on('error', (err, ctx) => {
    console.error(err);
  });

module.exports = app;
