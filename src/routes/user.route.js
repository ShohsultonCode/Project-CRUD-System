const { Router } = require("express");
const { getAllUsers, getUser, deleteUser, createBlog, getAllBlogs, getBlog, updateblog, deleteblog, filterBlogs } = require("../controllers/client/user.controller")
const { verif_Token } = require("../guards/isAuth.middleware")
const { checkRole } = require("../guards/checkRole.middleware")
const router = Router();


//Initialize the router


//For Users 
router.get("/users", verif_Token, getAllUsers)
router.get("/user/:id", verif_Token, getUser)
router.delete("/user/:id", verif_Token, deleteUser)


//For Blogs
router.get("/blogs", getAllBlogs)
router.get("/blog/:id", getBlog)
router.post("/create/blog", verif_Token, createBlog)
router.put("/update/blog/:id", verif_Token, checkRole(['admin', 'user']), updateblog)
router.delete("/delete/blog/:id", verif_Token, checkRole(['admin', 'user']), deleteblog)
router.post("/filter/blogs", verif_Token, filterBlogs)




module.exports = router;

