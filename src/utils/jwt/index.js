const jwt = require("jsonwebtoken");
const UserToken = require("../../models/token.model.js");

const generateTokens = async (user) => {
    try {
        const payload = { id: user.id, user_role: user.user_role };
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "7h" }
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: "30d" }
        );

        const userToken = await UserToken.findOne({ token_user_id: user.id });
        if (userToken) await userToken.deleteOne({ token_user_id: user.id });

        await new UserToken({ token_user_id: user.id, token: refreshToken }).save();
        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};


const verifyRefreshToken = async (refreshToken) => {
    const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

    try {
        const doc = await UserToken.findOne({ token: refreshToken });

        if (!doc) {
            throw { error: true, message: "Invalid refresh token" };
        }

        const tokenDetails = await jwt.verify(refreshToken, privateKey);

        return {
            tokenDetails,
            error: false,
            message: "Valid refresh token",
        };
    } catch (error) {
        throw { error: true, message: "Invalid refresh token" };
    }
};


module.exports = { generateTokens, verifyRefreshToken };
