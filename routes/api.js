const router = new (require('koa-router'))();
const api = require('../api');

router.all('/api/v1', api);

module.exports = router;
