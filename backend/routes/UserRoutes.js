const router =require("express").Router()
const UserController = require("../controllers/UserController")

// middlewares
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

router.post("/register", UserController.register)
router.get("/checkuser", UserController.checkUser)
router.post("/login", UserController.login)
//antes de chamar o editUser, verifica se o token é válido(verifyToken)
// router.patch("/edit/:id",verifyToken,UserController.editUser)
router.get("/:id", UserController.getUserById)

// .single("image"): Este método indica que o middleware deve esperar um único arquivo no corpo da requisição com o campo de nome "image". Exemplo: o campo name, carregao nome, o campo password, carra a senha e o campo image, carrega a imagem
router.patch("/edit/:id",verifyToken,imageUpload.single("image"),UserController.editUser
  );

module.exports = router