const git = require("./git")
const lint = require("./lint")
const message = require("./message")

const analyze = async function(commit,repo,ctx) {
  await git.clone_branch(`src/public/repos/${commit.id}`,repo.fullName,commit.branch)
  await lint(commit,ctx)
  await message(commit,ctx)
}

module.exports = analyze