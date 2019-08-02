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

const formatting = require('./util/formatting.js');

const app = new Koa();

app.use(logger());
app.use(errorHandler());
app.use(bodyparser({ enableTypes: ['json', 'form'] }));

app.use(apiRoutes.routes(), apiRoutes.allowedMethods());

app.use(koastatic(path.join(__dirname, 'public')));
app.use(views(path.join(__dirname, 'views'), {
  extension: 'pug',
  globals: {
    ...formatting,
  },
}));
app.use(authenticateUser());
app.use(async (ctx, next) => {
  ctx.viewGlobals.loggedIn = ctx.auth.loggedIn;
  ctx.viewGlobals.userName = ctx.auth.userName;
  await next();
});

app.use(indexRoutes.routes(), indexRoutes.allowedMethods());
app.use(organizationsRoutes.routes(), organizationsRoutes.allowedMethods());
app.use(productsRoutes.routes(), productsRoutes.allowedMethods());
app.use(subscriptionsRoutes.routes(), subscriptionsRoutes.allowedMethods());
app.use(ajaxRoutes.routes(), ajaxRoutes.allowedMethods());

app.on('error', (err, ctx) => {
  console.error(err);
});

module.exports = app;
