const exec = require("child_process")
const fs = require("fs")

const parseFile = function(file){
  const data = fs.readFileSync(file, 'utf8')
  const json = data.slice(data.indexOf(`[{`))
  return JSON.parse(json)
}

const runLint = async function(commit) {
  exec.execSync(`npm run --prefix src/public/repos/${commit.id}/  lint -- -f json > src/public/lint/${commit.id}.json` )
  const json = parseFile(`src/public/lint/${commit.id}.json`)
}

module.exports = runLint