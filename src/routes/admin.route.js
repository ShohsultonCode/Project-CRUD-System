const { Router } = require("express");

const router = Router();

const { checkRole } = require("../guards/checkRole.middleware");
const { dashboard, recentBlogs } = require("../controllers/admin");

router.get("/dashboard", checkRole(['admin']), dashboard);
router.get("/recent/blogs", checkRole(['admin']), recentBlogs);


module.exports = router;

