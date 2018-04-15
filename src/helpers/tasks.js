const findInFiles = require("find-in-files");

const analyzeTask = async function(commit, ctx,taskWord,taskValue){
  const results = await findInFiles.findSync(taskWord,`src/public/repos/${commit.id}`)
  Object.entries(results).forEach((result) => {
    if (results[result[0]].count > 0) {
      ctx.orm.Score.create({type:"task",message:`${results[result[0]].count} ${taskWord} in ${result[0]}`, value:taskValue * results[result[0]].count,commitId:commit.id})
    }
  });
  }

const analyzeTasks = async function(commit,ctx){
  for(let i=0; i < ctx.state.rules.tasks.words.length;i++){
    analyzeTask(commit,ctx,ctx.state.rules.tasks.words[i],ctx.state.rules.tasks.value[i])
  }
}

module.exports = analyzeTasks