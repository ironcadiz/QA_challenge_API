const KoaRouter = require("koa-router")
const auth = require("../middlewares/authentication")
const parseRules = require("../middlewares/rules")
const _ = require("lodash")
const analize = require("../helpers/analyzeCommit")

const router = new KoaRouter()

router.use("/all", auth)

router.get("commits", "/all", async ctx => {
  console.log("user id", ctx.state.currentUser)
  const commits = await ctx.orm.Commit.findAll({
    where: {
      userId: ctx.state.currentUser.id,
    },
  })

  ctx.body = _.reduce(
    commits,
    (prev, next) => {
      if (!prev[next.repositoryId]) prev[next.repositoryId] = []
      return {
        ...prev,
        [next.repositoryId]: [...prev[next.repositoryId], next],
      }
    },
    {}
  )
})

const create_commits = async (ctx, commits, repo, ref) => {
  const promises = commits.map(async commit => {
    const commiter = await ctx.orm.user.findOne({ where: {email: commit.author.email }})
    const dbCommit = await ctx.orm.Commit.create({userId:commiter.id, repositoryId: repo.id, commitId:commit.id, branch:ref.split("/").slice(-1)[0]})
    repo.addContributor(commiter)
    analize(dbCommit, repo, ctx)
    return dbCommit
  })
  return promises
}

//create commit from webhook
router.use(parseRules)
router.post("commit_create", "/", async ctx => {
  const { ref, commits, repository } = ctx.request.body
  const response = {}
  const repo = await ctx.orm.Repository.findOne({
    where: { repoId: repository.id },
  })
  if (repo) {
    create_commits(ctx, commits, repo,ref)
  } else {
    const owner = await ctx.orm.user.findOne({where:{email:repository.owner.email}})
    const new_repo = await ctx.orm.Repository.create({repoId:repository.id,name:repository.name, ownerId:owner.id, fullName:repository.full_name})
    create_commits(ctx, commits, new_repo, ref)
    response.repo = new_repo
  }
  ctx.body = response
})

module.exports = router
