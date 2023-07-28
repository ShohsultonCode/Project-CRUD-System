const { Router } = require("express");
const { getAllUsers, getUser } = require("../controllers/client/user.controller")
const { verif_Token } = require("../guards/isAuth.middleware")

const router = Router();


router.get("/users", verif_Token, getAllUsers)
router.get("/user/:id", verif_Token, getUser)

//Initialize the router

module.exports = router;

