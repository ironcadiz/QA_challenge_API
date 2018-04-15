const KoaRouter = require("koa-router")

const router = new KoaRouter()

router.get("index", "/", async ctx => {
  const commiter = await ctx.orm.user.findOne({ where: { id: 1 } })
  const commit = await ctx.orm.Commit.findOne({ where: { id: 1 } })
  const repository = await ctx.orm.Repository.findOne({ where: { id: 1 } })
  const constributors = await repository.getContributors()
  ctx.body = {
    message: "Hello World",
    commiter,
    commit,
    repository,
    constributors,
  }
})

module.exports = router
