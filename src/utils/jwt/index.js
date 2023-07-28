const jwt = require("jsonwebtoken");

const generateTokens = async (user) => {
    try {
        const payload = { id: user.id };
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "7h" }
        );
        return accessToken;
    } catch (err) {
        res.status(500).json({ message: `Server error${error.message},`, statusCode: 500 });
    }
};

module.exports = { generateTokens };
