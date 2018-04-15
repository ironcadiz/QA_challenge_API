const KoaRouter = require("koa-router")
const auth = require("../middlewares/authentication")
const request = require("superagent")

const router = new KoaRouter()

router.use(auth)

// mostrar todos los repos de un usuario.

//mostrar cierto repo.?

//Agregar un repositorio a la plataforma
router.post("repository create", "/", async ctx => {
  const user = ctx.state.currentUser
  const { name } = ctx.request.body
  const repo = await request
    .get("https://api.github.com/repos/" + user.name + "/" + name)
    .set("Content-Type", "application/json")
    .set("Authorization", "Bearer " + user.gitToken)

  const repository = await ctx.orm.Repository.find({ where: { name } })
  if (!repository) {
    ctx.body = {
      error: true,
      message: "El repositorio ya se encuentra agregado",
    }
  } else {
    ctx.body = { repository: repository }
    var repoId = repo.body.id
    var score = 0
    var url = repo.body.url
    var fullName = repo.body.full_name

    const newRepo = await ctx.orm.Repository.create({
      name,
      fullName,
      score,
      url,
      repoId,
      ownerId: user.id,
    })
    const hook = await request
      .post("https://api.github.com/repos/" + user.name + "/" + name + "/hooks")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + user.gitToken)
      .send({
        name: "web",
        active: true,
        events: ["push", "pull_request"],
        config: {
          url: "http://localhost:3000/commits",
          content_type: "json",
        },
      })
    ctx.body = {
      error: false,
      repository: newRepo,
    }
  }
})

//Editar un repositorio a la plataforma
//Eliminar un repositorio
//Crear el webhook

module.exports = router
