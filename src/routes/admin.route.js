const { Router } = require("express");

const router = Router();

const { verif_Token } = require("../guards/isAuth.middleware")
const { checkRole } = require("../guards/checkRole.middleware")


module.exports = router;

