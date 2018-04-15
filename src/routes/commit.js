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
    include: ["Scores"],
  })

  const scores = [await ctx.orm.Score.sum('value',{where:{type:'task',userId: ctx.state.currentUser.id}}),await ctx.orm.Score.sum('value',{where:{type:'lint',userId: ctx.state.currentUser.id}}),await ctx.orm.Score.sum('value',{where:{type:'commit',userId: ctx.state.currentUser.id}})]
  ctx.body = {
    1: [
      {
        id: 1,
        message: "Init Repo",
        score: 11,
        Scores: [5, 20, 8],
      },
      {
        id: 2,
        message: "First Push",
        score: 17,
        Scores: [11, 20, 20],
      },
      {
        id: 3,
        message: "Models",
        score: 11,
        Scores: [10, 12, 11],
      },
      {
        id: 4,
        message: "Migrations",
        score: 7,
        Scores: [5, 7, 9],
      },
      {
        id: 5,
        message: "Login",
        score: 5,
        Scores: [2, 3, 10],
      },
    ],
    ..._.reduce(
      commits,
      (prev, next) => {
        if (!prev[next.repositoryId]) prev[next.repositoryId] = []
        return {
          ...prev,
          [next.repositoryId]: [...prev[next.repositoryId], {...next, Scores: scores }],
        }
      },
      {}
    ),
  }
})

const create_commits = async (ctx, commits, repo, ref) => {
  const promises = commits.map(async commit => {
    const commiter = await ctx.orm.user.findOne({
      where: { email: commit.author.email },
    })
    const dbCommit = await ctx.orm.Commit.create({
      userId: commiter.id,
      repositoryId: repo.id,
      commitId: commit.id,
      branch: ref.split("/").slice(-1)[0],
      message: commit.message,
    })
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
    create_commits(ctx, commits, repo, ref)
  } else {
    const owner = await ctx.orm.user.findOne({
      where: { email: repository.owner.email },
    })
    const new_repo = await ctx.orm.Repository.create({
      repoId: repository.id,
      name: repository.name,
      ownerId: owner.id,
      fullName: repository.full_name,
    })
    create_commits(ctx, commits, new_repo, ref)
    response.repo = new_repo
  }
  ctx.body = response
})

module.exports = router
