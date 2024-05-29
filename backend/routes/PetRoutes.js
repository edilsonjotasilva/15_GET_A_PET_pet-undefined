const router =require("express").Router()
const PetController = require("../controllers/PetController")

// middlewares
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

// .array("image"): Este método indica que o middleware deve esperar vários arquivos no corpo da requisição com o campo de nome "images". Exemplo: o campo name, carregao nome, o campo password, carra a senha e o campo images, carrega as imagens
router.post("/create",verifyToken,imageUpload.array('images'), PetController.create)

router.get("/", PetController.getAll)
router.get("/mypets",verifyToken, PetController.getAllUserPets)
router.get("/myadoptions",verifyToken, PetController.getAllUserAdoptions)
router.get('/:id', PetController.getPetById)
router.delete("/:id",verifyToken, PetController.removePtById)
router.patch(
    '/:id',
    verifyToken,
    imageUpload.array('images'),
    PetController.updatePet,
)

router.patch("/schedule/:id",verifyToken, PetController.schedule)
router.patch("/conclude/:id",verifyToken, PetController.concludeAdopter)


    



module.exports = router