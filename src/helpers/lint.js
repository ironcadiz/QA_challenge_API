const exec = require("child_process")

const runLint = async function(commit) {
  exec.execSync(`npm run --prefix src/public/repos/${commit.id}/  lint -- -f json >> src/public/lint/${commit.id}.json` )
}

module.exports = runLint