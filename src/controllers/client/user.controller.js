const { default: mongoose } = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import uuidv4 with the correct syntax
const User = require("../../models/users.model");
const Blog = require("../../models/blogs.model");
const { blogValidator, blogUpdateValidator } = require("../../utils/validators");


//Users


// Get all users
const getAllUsers = async (req, res) => {
    const users = await User.find({ user_role: "user", user_isactive: true });
    res.status(200).json({ data: users });
};

// Get a user by ID
const getUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid id", statusCode: 400 });
    }

    try {
        // Find the user by id
        const user = await User.findById(id);


        if (!user || !user.user_isactive || user.user_role === "admin") {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", statusCode: 500 });
    }
};

// Deactivate a user by ID
const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid id", statusCode: 400 });
    }

    try {
        // Find the user by id
        const user = await User.findById(id);

        if (!user || !user.user_isactive) {
            return res.status(404).json({ message: "User not found" });
        }

        // Deactivate the user
        user.user_isactive = false;
        await user.save();

        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", statusCode: 500 });
    }
};





//Blogs
// Create a new blog
const createBlog = async (req, res) => {
    const { id } = req.user;
    const { error, value } = await blogValidator.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { blog_title, blog_content } = value;
    const uuid = uuidv4(); // No need for await as it's a synchronous function

    if (!req.files || !req.files.blog_image) {
        return res.status(404).json({ message: "Blog image not found" });
    }

    const file = req.files.blog_image;
    file.mv("uploads/" + uuid + ".png", async (err) => {
        if (err) {
            return res.status(500).json({ message: "Error uploading blog image" });
        }

        const newBlog = await new Blog({
            blog_title: blog_title.toLowerCase().trim(),
            blog_content: blog_content.toLowerCase().trim(),
            blog_image: uuid + ".png",
            blog_user: id,
        });

        await newBlog.save();
        res.status(201).json({ data: newBlog });
    });
};

// Get all blogs with the user data populated
const getAllBlogs = async (req, res) => {
    try {
        const allBlogs = await Blog.find({ blog_isactive: true }).populate({
            path: 'blog_user',
            select: 'user_first_name user_last_name', // Select specific fields from the user document
        });

        res.status(200).json({ data: allBlogs });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", statusCode: 500 });
    }
};


// Get a blog by ID
const getBlog = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid id", statusCode: 400 });
    }

    try {
        // Find the blog by id and populate the 'blog_user' field
        const blog = await Blog.findById(id).populate({
            path: 'blog_user',
            select: 'user_first_name user_last_name', // Select specific fields from the user document
        });

        if (!blog || !blog.blog_isactive) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ data: blog });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", statusCode: 500 });
    }
};

// Deactivate a blog by ID
const deleteblog = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid id", statusCode: 400 });
    }

    try {
        // Find the blog by id
        const blog = await Blog.findById(id);

        if (!blog || !blog.blog_isactive) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if the user making the request is the author or an admin
        if (userId !== blog.blog_user.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to update this blog" });
        }



        // Deactivate the blog
        blog.blog_isactive = false;
        await blog.save();

        res.status(200).json({ data: blog });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", statusCode: 500 });
    }
};

// Update a blog by ID
const updateblog = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { error, value } = await blogUpdateValidator.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid id", statusCode: 400 });
    }

    const { blog_title, blog_content } = value;
    try {
        // Find the blog by id
        const blog = await Blog.findById(id);

        if (!blog || !blog.blog_isactive) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if the user making the request is the author or an admin
        if (userId !== blog.blog_user.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to update this blog" });
        }

        if (req.files && req.files.blog_image) {
            const file = req.files.blog_image;
            const uploadPath = "uploads/"; // Specify the path to the upload directory
            const fileName = uuidv4(); // Generate a unique file name based on user ID or any other unique identifier
            await file.mv(uploadPath + `${fileName}.png`);
            blog.blog_image = `${fileName}.png`;
        }

        // Update the blog with the new data
        blog.blog_title = blog_title || blog.blog_title;
        blog.blog_content = blog_content || blog.blog_content;

        await blog.save();

        res.status(200).json({ data: blog });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", statusCode: 500 });
    }
}


const filterBlogs = async (req, res) => {
    const { value } = req.body;

    if (!value) {
        return res.status(400).json({ message: "Filter value not provided" });
    }

    try {
        // Filter blogs based on the provided value in the 'blog_title' and 'blog_content' fields
        const filteredBlogs = await Blog.find({
            $and: [
                {
                    $or: [
                        { blog_title: { $regex: value, $options: "i" } },
                        { blog_content: { $regex: value, $options: "i" } },
                    ],
                },
                { blog_isactive: true }, // Add the condition for blog_isactive
            ],
        }).populate({
            path: 'blog_user',
            select: 'user_first_name user_last_name',
        });

        if (filteredBlogs.length === 0) {
            return res.status(404).json({ message: "No blogs matching the filter value" });
        }

        res.status(200).json({ data: filteredBlogs });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", statusCode: 500 });
    }
};


const myBlogs = async (req, res) => {
    try {
        const { id } = req.user; // Assuming req.user contains the authenticated user's information

        // Find blogs belonging to the specified user
        const userBlogs = await Blog.find({ blog_user: id, blog_isactive: true })
            .populate({
                path: 'blog_user',
                select: 'user_first_name user_last_name',
            })
            .exec();

        res.status(200).json(userBlogs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user blogs' });
    }
};


module.exports = {
    getAllUsers,
    getUser,
    deleteUser,
    createBlog,
    getAllBlogs,
    getBlog,
    updateblog,
    deleteblog,
    filterBlogs,
    myBlogs
}
