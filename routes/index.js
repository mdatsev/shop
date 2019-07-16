const router = new (require('koa-router'))()
const db = require('../db.js')
const bcrypt = require('bcrypt');

router.get('/login', async (ctx, next) => {
    await ctx.render('login')
})

router.post('/login', async (ctx, next) => {
    const {email, password, remember} = ctx.request.body
    const result = await db.query(`SELECT "password" FROM "user" WHERE "email" = $1`, [email])
    const hash = result.rows[0].password
    ctx.body = await comparePassword(password, hash)  
})

router.get('/register', async (ctx, next) => {
    await ctx.render('register')
})

router.post('/register', async (ctx, next) => {
    const {name, email, password} = ctx.request.body
    const password_hash = await hashPassword(password)
    await db.query(
        `INSERT INTO "user" ("name", "email", "password") VALUES ($1, $2, $3)`, 
        [name, email, password_hash]
    )
})

function hashPassword(password) {
    return bcrypt.hash(password, 10)
}

function comparePassword(password, hash) {
    return bcrypt.compare(password, hash)
}

module.exports = router
