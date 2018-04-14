const KoaRouter = require("koa-router")
const auth = require("../middlewares/authentication")

const router = new KoaRouter()

router.use(auth)

//Devolver un repositorio determinado
//Devolver todos los repositorios de un usuario
//Agregar un repositorio a la plataforma
//Editar un repositorio a la plataforma
//Eliminar un repositorio
//Crear el webhook


module.exports = router
