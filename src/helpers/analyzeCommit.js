const git = require("./git")
const lint = require("./lint")
const message = require("./message")
const tasks = require("./tasks")

const analyze = async function(commit,repo,ctx) {
  await git.clone_branch(`src/public/repos/${commit.id}`,repo.fullName,commit.branch)
  await lint(commit,ctx)
  await message(commit,ctx)
  await tasks(commit,ctx)
  const sum = await ctx.orm.Score.sum("value",{where:{commitId:commit.id}})
  console.log(sum)
  if (!repo.score) {
    commit.score = sum
  } else {
    commit.score = sum - repo.score
  }
  repo.score = sum
  await repo.save()
  await commit.save()
  console.log(commit.score)
  console.log(repo.score)
}

module.exports = analyze