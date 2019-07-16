const router = new (require('koa-router'))()
const db = require('../db.js')

router.get('/login', async (ctx, next) => {
    await ctx.render('login')
})

router.post('/login', async (ctx, next) => {
    const {email, password, remember} = ctx.request.body
})

router.get('/register', async (ctx, next) => {
    await ctx.render('register')
})

router.post('/register', async (ctx, next) => {
    const {name, email, password} = ctx.request.body
})

module.exports = router
