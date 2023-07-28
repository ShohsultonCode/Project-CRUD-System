const User = require("../../models/users.model");
const Blog = require("../../models/blogs.model");


const dashboard = async (req, res) => {
    try {
        const allUsers = await User.find({ user_isactive: true });
        const allBlogs = await Blog.find({ blog_isactive: true });

        const allUsersLength = allUsers.length;
        const allBlogsLength = allBlogs.length;

        res.status(200).json({ allUsers: allUsersLength, allBlogs: allBlogsLength });
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    dashboard,
};



const recentBlogs = async (req, res) => {
    const recentBlogs = await Blog.find()
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order (most recent first)
        .limit(3);

    res.status(200).json({ data: recentBlogs })

}

module.exports = {
    dashboard,
    recentBlogs
}