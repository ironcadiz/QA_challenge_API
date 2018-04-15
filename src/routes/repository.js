const KoaRouter = require("koa-router")
const auth = require("../middlewares/authentication")

const router = new KoaRouter()

router.use(auth)

// mostrar todos los repos de un usuario.

//mostrar cierto repo.?

//Agregar un repositorio a la plataforma
router.post("repository create", "/", async ctx => {
  const token = ctx.headers.token
  const user = ctx.state.currentUser
  const { repoId, name} = ctx.request.body
  const newRepo = await ctx.orm.Repository.create({repoId,name,ownerId: user.id,})
  ctx.body = { repository:newRepo }
})

router.get("repositories", "/", async ctx => {
  const repositories = await ctx.orm.Repository.findAll({
    where: {
      ownerId: ctx.state.currentUser.id,
    },
  })
  ctx.body = repositories
})

//Editar un repositorio a la plataforma
//Eliminar un repositorio
//Crear el webhook

module.exports = router
