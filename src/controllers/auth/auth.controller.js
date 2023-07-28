//Required 
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const uuidv4 = require("uuid")
const User = require("../../models/users.model")
const { userPostValidator, userLoginValidator } = require("../../utils/validators")
const { generateTokens } = require("../../utils/jwt")
const { default: mongoose } = require("mongoose")

//Register 
const singup = async (req, res) => {
    try {
        const { error, value } = await userPostValidator.validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        const {
            user_first_name,
            user_last_name,
            user_username,
            user_password } = value


        const user = await User.findOne({ user_username: user_username.toLowerCase().trim() })

        if (user) return res.status(400).json({ message: "User already exists" })


        const hashPassword = await bcrypt.hash(user_password, 10)

        const newUser = await new User({
            user_first_name: user_first_name.toLowerCase().trim(),
            user_last_name: user_last_name.toLowerCase().trim(),
            user_username: user_username.toLowerCase().trim(),
            user_password: hashPassword,
            user_role: "user"
        })

        await newUser.save()

        const accessToken = await generateTokens(newUser);

        // Omit user_role and user_password from the response
        res.status(201).json({
            statusCode: 201,
            accessToken: accessToken,
            user: newUser
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error", statusCode: 500 });
    }
}

//Login

const singing = async (req, res) => {
    try {
        const { error, value } = await userLoginValidator.validate(req.body);

        if (error) return res.status(400).json({ message: error.details[0].message });

        const { user_username, user_password } = value;

        const user = await User.findOne({ user_username: user_username.toLowerCase().trim() });

        if (!user) return res.status(401).json({ message: "Invalid username or password" });

        const isPasswordValid = await bcrypt.compare(user_password, user.user_password);

        if (!isPasswordValid) return res.status(401).json({ message: "Invalid password or username" });

        await user.save()
        const accessToken = await generateTokens(user);

        res.status(200).json({
            statusCode: 200,
            accessToken: accessToken,
            user: user
        });
    } catch (error) {
        res.status(500).json({ message: `Server error${error.message},`, statusCode: 500 });
    }
};


//Update Profile
const updateProfile = async (req, res) => {
    try {
        const { user_first_name, user_last_name, user_username, user_password } = req.body;
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId))
            return res.status(400).json({ message: "id not found", statusCode: 400 });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.user_first_name = user_first_name?.toLowerCase().trim() || user.user_first_name;
        user.user_last_name = user_last_name?.toLowerCase().trim() || user.user_last_name;
        user.user_username = user_username?.toLowerCase() || user.user_username;

        if (req.files?.user_image) {
            const fileName = await uuidv4.v4();
            await req.files.user_image.mv(`uploads/${fileName}.png`);
            user.user_image = `${fileName}.png`;
        }

        if (user_password) user.user_password = await bcrypt.hash(user_password, 10);

        await user.save();

        res.status(200).json({ statusCode: 200, message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", statusCode: 500 });
    }
};






//Export all controllers
module.exports = {
    singup,
    singing,
    updateProfile,
}