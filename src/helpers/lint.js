const exec = require("child_process")
const fs = require("fs")

const parseFile = function(file){
  const data = fs.readFileSync(file, 'utf8')
  const json = data.slice(data.indexOf(`[{`))
  return JSON.parse(json)
}

const generateScores = function(commit,json,ctx) {
  const errorCodes = {1:"warning",2:"error"}
  json.forEach( async (file) => {
    if (file.errorCount > 0 || file.warningCount > 0) {
      console.log(file.filePath)
      file.messages.forEach( async (message) => {
        ctx.orm.Score.create({type:"lint",message:message.message,value: -ctx.state.rules.lint[errorCodes[message.severity]],commitId:commit.id})
      })
    }
  })
}

const runLint = async function(commit,ctx) {
  try{
    exec.execSync(`npm run --prefix src/public/repos/${commit.id}/  lint -- -f json > src/public/lint/${commit.id}.json` )
  } catch(err) {}
  const json = parseFile(`src/public/lint/${commit.id}.json`)
  return generateScores(commit,json,ctx)
}

module.exports = runLint