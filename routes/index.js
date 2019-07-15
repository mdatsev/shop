const router = require('koa-router')()
const db = require('../db.js')

router.get('/', async (ctx, next) => {
    ctx.body = await db.query('SELECT $1::text as message', ['Hello world!'])
})

module.exports = router
