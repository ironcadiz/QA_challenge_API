const shell = require("shelljs")

async function clone(dir, repo){
  return shell.exec(`git clone https://github.com/${repo} ${dir}`, {async:true})
}

async function clone_branch(dir, repo, branch){
  return shell.exec(`git clone -b ${branch} https://github.com/${repo} ${dir}`)
}

function pull(dir, type) {
  shell.cd(dir)
  shell.exec(`git pull origin ${type}`)
  shell.cd("..")
}

module.exports = { clone, pull, clone_branch }
