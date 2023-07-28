const { Router } = require("express");

const router = Router();

const { singup, singing, refreshNew, updateProfile, singupprovider } = require("../controllers/auth/auth.controller");
const { verif_Token } = require("../guards/isAuth.middleware")

router.post("/auth/singup", singup);
router.post("/auth/singup/provider", singupprovider);
router.post("/auth/singing", singing);
router.put("/auth/update/profile/:id", verif_Token, updateProfile);
router.post("/auth/refresh", refreshNew)


module.exports = router;

