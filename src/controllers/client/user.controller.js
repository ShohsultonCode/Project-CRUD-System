const { default: mongoose } = require("mongoose")
const User = require("../../models/users.model")



//Get all users 
const getAllUsers = async (req, res) => {
    const users = await User.find()
    res.status(200).json({ data: users })
}


//Get a user 
const getUser = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "id not found", statusCode: 400 });
    }

    const user = await User.findById(id)

    if (user.user_isactive === false || !user) {
        return res.status(400).json({ message: "User not found" })
    }

    res.status(200).json({ data: user })
}






module.exports = {
    getAllUsers,
    getUser
}