const fs = require('fs');

async function parseRules(ctx, next) {
  const {repository} = ctx.request.body
  const repo = await ctx.orm.Repository.findOne({ where: { repoId: repository.id } })
  if (repo) {
    ctx.state.rules = JSON.parse(fs.readFileSync(`src/public/${repo.repoId}_rules.json`, 'utf8'))
  } else {
    ctx.state.rules = JSON.parse(fs.readFileSync(`src/public/default_rules.json`, 'utf8'))
  }
  return next()
}
module.exports = parseRules