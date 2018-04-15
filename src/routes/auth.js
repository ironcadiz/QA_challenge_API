const KoaRouter = require("koa-router")
const jwtgenerator = require("jsonwebtoken")
const request = require("superagent")
const router = new KoaRouter()

router.post("auth", "/", async ctx => {
  const { email, password } = ctx.request.body
  const user = await ctx.orm.user.find({ where: { email } })
  if (user && (await user.checkPassword(password))) {
    const token = await new Promise((resolve, reject) => {
      jwtgenerator.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        (err, tokenResult) => (err ? reject(err) : resolve(tokenResult))
      )
    })
    ctx.body = { token }
  } else {
    ctx.throw(401, "Wrong e-mail or password")
  }
})

router.post("github/signin", "/github", async ctx => {
  const data = await request
    .post("https://github.com/login/oauth/access_token")
    .send({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: ctx.request.body.code.code,
    })
    .end()
  var access_token = data.body.access_token
  const emails = await request
    .get("https://api.github.com/user/emails")
    .set("Content-Type", "application/json")
    .set("Authorization", "Bearer " + access_token)

  var email = emails.body[0].email
  const user = await ctx.orm.user.find({ where: { email } })
  if (user && (await user.checkPassword("123123"))) {
    user.updateAttributes({ gitToken: access_token })
    const token = await new Promise((resolve, reject) => {
      jwtgenerator.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        (err, tokenResult) => (err ? reject(err) : resolve(tokenResult))
      )
    })
    ctx.body = { token, access_token }
  } else {
    const userRequest = await request
      .get("https://api.github.com/user")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + access_token)
    var name = userRequest.body.login
    const user = ctx.orm.user.build({
      email,
      password: "123123",
      name: name,
      gitToken: access_token,
    })
    try {
      await user.save({ fields: ["email", "password", "name", "gitToken"] })
      const token = await new Promise((resolve, reject) => {
        jwtgenerator.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.JWT_SECRET,
          (err, tokenResult) => (err ? reject(err) : resolve(tokenResult))
        )
      })
      ctx.body = { token, access_token }
    } catch (e) {
      ctx.body = {
        message: "Error creating user",
        error: e,
      }
      ctx.status = 400
    }
  }
})

module.exports = router
