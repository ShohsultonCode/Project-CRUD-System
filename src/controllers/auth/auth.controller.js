//Required 
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const uuidv4 = require("uuid")
const User = require("../../models/users.model")
const TokenModel = require("../../models/token.model")
const { userPostValidator, refreshTokenBodyValidation, userUpdateValidator, userLoginValidator } = require("../../utils/validators")
const { generateTokens, verifyRefreshToken } = require("../../utils/jwt")
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
            user_job,
            user_location_region,
            user_location_country,
            user_address,
            user_description,
            user_born,
            user_contact,
            user_email,
            user_password } = value

        const user = await User.findOne({ user_username: user_username.toLowerCase().trim() })
        const useremail = await User.findOne({ user_email: user_email })
        const uuid = await uuidv4.v4()


        if (user || useremail) return res.status(400).json({ message: "User already exists" })


        if (req.files && req.files.user_image) {
            const file = req.files.user_image
            file.mv("uploads/" + uuid + ".png", async (err) => {
                if (err) return res.status(500).send(err)
            })
        } else {
            return res.status(404).json({ message: "User image not found" })
        }
        const hashPassword = await bcrypt.hash(user_password, 10)



        const newUser = await new User({
            user_first_name: user_first_name,
            user_last_name: user_last_name,
            user_username: user_username.toLowerCase().trim(),
            user_email,
            user_password: hashPassword,
            user_description: user_description,
            user_born,
            user_contact,
            user_job: user_job,
            user_image: uuid + '.png',
            user_location_region: user_location_region,
            user_location_country: user_location_country,
            user_address: user_address,
            user_role: "user"
        })


        await newUser.save()



        const { accessToken, refreshToken } = await generateTokens(newUser);

        // Omit user_role and user_password from the response
        res.status(201).json({
            statusCode: 201,
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: newUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error", statusCode: 500 });
    }
}

const singupprovider = async (req, res) => {
    try {
        const { error, value } = await userPostValidator.validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        const {
            user_first_name,
            user_last_name,
            user_username,
            user_job,
            user_location_region,
            user_location_country,
            user_address,
            user_description,
            user_born,
            user_contact,
            user_email,
            user_password } = value

        const user = await User.findOne({ user_username: user_username.toLowerCase().trim() })
        const useremail = await User.findOne({ user_email: user_email })
        const uuid = await uuidv4.v4()


        if (user || useremail) return res.status(400).json({ message: "User already exists" })


        const hashPassword = await bcrypt.hash(user_password, 10)

        if (req.files && req.files.user_image) {
            const file = req.files.user_image
            file.mv("uploads/" + uuid + ".png", async (err) => {
                if (err) return res.status(500).send(err)
            })
        } else {
            return res.status(404).json({ message: "Image not found" })
        }


        const newUser = await new User({
            user_first_name: user_first_name,
            user_last_name: user_last_name,
            user_username: user_username.toLowerCase(),
            user_email,
            user_password: hashPassword,
            user_description: user_description,
            user_born,
            user_contact,
            user_job: user_job,
            user_image: uuid + '.png',
            user_location_region: user_location_region,
            user_location_country: user_location_country,
            user_address: user_address,
            user_role: "provider"
        })


        await newUser.save()



        const { accessToken, refreshToken } = await generateTokens(newUser);


        res.status(201).json({
            statusCode: 201,
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: newUser
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", statusCode: 500 });

    }
}



//Login
const singing = async (req, res) => {
    try {
        const { error, value } = await userLoginValidator.validate(req.body);

        if (error) return res.status(400).json({ message: error.details[0].message });

        const { user_username, user_password } = value;

        const user = await User.findOne({ user_username: user_username.toLowerCase() });

        if (!user) return res.status(401).json({ message: "Invalid username or password" });

        const isPasswordValid = await bcrypt.compare(user_password, user.user_password);

        if (!isPasswordValid) return res.status(401).json({ message: "Invalid email or password" });

        user.user_last_login_date = Date.now();
        // Password is valid, generate access and refresh tokens

        await user.save()
        const { accessToken, refreshToken } = await generateTokens(user);

        res.status(200).json({
            statusCode: 200,
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: user
        });
    } catch (error) {
        res.status(500).json({ message: `Server error${error.message},`, statusCode: 500 });
    }
};


//Update Profile
const updateProfile = async (req, res) => {
    try {


        const {
            user_first_name,
            user_last_name,
            user_username,
            user_job,
            user_location_region,
            user_location_country,
            user_address,
            user_description,
            user_born,
            user_contact,
            user_email,
            user_password,
            user_payment,
            user_subscription
        } = req.body;

        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "id not found", statusCode: 400 });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        // Update user fields
        user.user_first_name = user_first_name ? user_first_name : user.user_first_name;
        user.user_last_name = user_last_name ? user_last_name : user.user_last_name;
        user.user_username = user_username ? user_username.toLowerCase() : user.user_username;
        user.user_job = user_job ? user_job : user.user_job;
        user.user_location_region = user_location_region ? user_location_region : user.user_location_region;
        user.user_location_country = user_location_country ? user_location_country : user.user_location_country;
        user.user_address = user_address ? user_address : user.user_address;
        user.user_description = user_description ? user_description : user.user_description;
        user.user_born = user_born ? user_born : user.user_born;
        user.user_contact = user_contact ? user_contact : user.user_contact;
        user.user_email = user_email ? user_email : user.user_email;

        if (req.files && req.files.user_image) {
            const file = req.files.user_image;
            const uploadPath = "uploads/"; // Specify the path to the upload directory
            const fileName = await uuidv4.v4(); // Generate a unique file name based on user ID or any other unique identifier
            await file.mv(uploadPath + `${fileName}.png`);
            user.user_image = `${fileName}.png`;
        } else {
            user.user_image = user.user_image
        }

        if (user_password) {
            const hashPassword = await bcrypt.hash(user_password, 10);
            user.user_password = hashPassword;
        }

        await user.save();

        res.status(200).json({
            statusCode: 200,
            message: 'User updated successfully',
            user: user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error', statusCode: 500 });
    }
};



//Refresh Token
const refreshNew = async (req, res) => {
    try {
        const { error, value } = await refreshTokenBodyValidation.validate(req.body);

        if (error) return res.status(400).json({ message: error.details[0].message });

        const { refreshToken } = value;


        verifyRefreshToken(refreshToken)
            .then(({ tokenDetails }) => {
                if (!tokenDetails) {
                    return res.status(400).json({ message: "Invalid refresh token" })
                }

                const payload = { id: tokenDetails.id, user_role: tokenDetails.roles };
                const accessToken = jwt.sign(
                    payload,
                    process.env.ACCESS_TOKEN_PRIVATE_KEY,
                    { expiresIn: "7h" }
                );
                res.status(200).json({
                    error: false,
                    accessToken,
                    message: "Access token created successfully",
                });
            })
            .catch((err) => res.status(400).json(err));
    } catch (error) {
        res.status(500).json({ message: "Server Error", statusCode: 500 });

    }
}






//Export all controllers
module.exports = {
    singup,
    singupprovider,
    singing,
    updateProfile,
    refreshNew,
}