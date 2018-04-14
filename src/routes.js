const KoaRouter = require("koa-router")
const router = new KoaRouter()

const index = require("./routes/index")
router.use("/", index.routes())

module.exports = router
