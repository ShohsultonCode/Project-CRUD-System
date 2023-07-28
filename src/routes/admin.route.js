const { Router } = require("express");
const { test } = require("../controllers/admin/admin-controllers")
const router = Router();

const { verif_Token } = require("../guards/isAuth.middleware")


router.get('/admin', test)

module.exports = router;

