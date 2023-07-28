const { Router } = require("express");

const router = Router();

const { singup, singing, updateProfile } = require("../controllers/auth/auth.controller");
const { verif_Token } = require("../guards/isAuth.middleware")

router.post("/auth/register", singup);
router.post("/auth/login", singing);
router.put("/auth/update/profile/:id", verif_Token, updateProfile);


module.exports = router;

