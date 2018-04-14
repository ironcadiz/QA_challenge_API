const KoaRouter = require("koa-router")
const auth = require("../middlewares/authentication")

const router = new KoaRouter()

const create_commits = async (ctx,commits,repo) => {
  const promises = commits.map(async commit => {
    const commiter = await ctx.orm.user.findOne({ where: {email: commit.author.email }})
    return await ctx.orm.Commit.create({userId:commiter.id, repositoryId: repo.id, commitId:commit.id})
  })
  return Promise.all(promises)
}

//create commit from webhook
router.post("commit_create", "/", async ctx => {
  const { commits, repository } = ctx.request.body
  const response = {}
  const repo = await ctx.orm.Repository.findOne({ where: { repoId: repository.id } })
  if (repo) {
    response.commits = await create_commits(ctx, commits, repo)
  } else {
    const owner = await ctx.orm.user.findOne({where:{email:repository.owner.email}})
    const new_repo = await ctx.orm.Repository.create({repoId:repository.id,name:repository.name, ownerId:owner.id})
    response.commits = await create_commits(ctx, commits, new_repo)
    response.repo = new_repo
  }
  ctx.body = response
})

router.use(auth)

module.exports = router
