const git = require("./git")
const lint = require("./lint")

const analyze = async function(commit,repo) {
  await git.clone_branch(`src/public/repos/${commit.id}`,repo.fullName,commit.branch)
  await lint(commit)
}

module.exports = analyze