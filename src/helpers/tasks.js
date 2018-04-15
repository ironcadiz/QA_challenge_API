const findInFiles = require("find-in-files");
const Promise = require("bluebird")

const analyzeTask = async function(commit, ctx,taskWord,taskValue){
  const results = await findInFiles.findSync(taskWord,`src/public/repos/${commit.id}`)
  await new Promise((res) => Object.entries(results).forEach(async (result, i, arr) => {
    if (results[result[0]].count > 0) {
      await ctx.orm.Score.create({type:"task",message:`${results[result[0]].count} ${taskWord} in ${result[0]}`, value:taskValue * results[result[0]].count,commitId:commit.id})
    }
    if(i === arr.length-1) res()
  }));
  }

const analyzeTasks = async function(commit,ctx){
  for(let i=0; i < ctx.state.rules.tasks.words.length;i++){
    await analyzeTask(commit,ctx,ctx.state.rules.tasks.words[i],ctx.state.rules.tasks.value[i])
  }
}

module.exports = analyzeTasks