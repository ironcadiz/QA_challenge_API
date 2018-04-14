const KoaRouter = require("koa-router")
const jwtgenerator = require("jsonwebtoken")
const octokit = require('@octokit/rest')

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

router.post("git.auth", "git", async ctx => {
  const gitToken = ctx.request.headers.token
  const client = await octokit.authorization.check(gitToken)
  // check if client is valid?
  


})

module.exports = router
