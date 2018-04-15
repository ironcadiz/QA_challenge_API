const analyzeMessage = function(commit,ctx){
  const regex = new RegExp(ctx.state.rules.commits.regex)
  if (!regex.test(commit.message)) {
    ctx.orm.Score.create({type:"commit",message:`commit message must validate ${ctx.state.rules.commits.regex}`,value:-ctx.state.rules.commits.value,commitId:commit.id})
  } else {
    ctx.orm.Score.create({type:"commit",message:`commit message validates ${ctx.state.rules.commits.regex}`,value:ctx.state.rules.commits.value,commitId:commit.id})
  }
}

module.exports = analyzeMessage