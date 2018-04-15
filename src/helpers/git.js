const shell = require("shelljs")

function clone(dir, repo){
  shell.exec(`git clone https://github.com/${repo} ${dir}`)
}

function clone_branch(dir, repo, branch){
  shell.exec(`git clone -b ${branch} https://github.com/${repo} ${dir}`)
}

function pull(dir, type) {
  shell.cd(dir)
  shell.exec(`git pull origin ${type}`)
  shell.cd("..")
}

module.exports = { clone, pull, clone_branch }
