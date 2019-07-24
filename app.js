const path = require('path');
const Koa = require('koa');
const logger = require('koa-logger');
const bodyparser = require('koa-bodyparser');
const views = require('koa-views');

const { authenticateUser } = require('./middleware/user_auth.js');

const index = require('./routes/index.js');
const api = require('./routes/api.js');

const app = new Koa();

app.use(logger());

app.use(bodyparser({
  enableTypes: ['json', 'form', 'text'],
}));

app.use(api.routes(), api.allowedMethods());

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(views(path.join(__dirname, 'views'), {
  extension: 'pug',
}));

app.use(async (ctx, next) => {
  await next();
  if (ctx.status === 404) {
    await ctx.render('404');
  }
});

app.use(authenticateUser);

app.use(index.routes(), index.allowedMethods());

app.on('error', (err, ctx) => {
  console.error(err);
});

module.exports = app;
