const test = async (req, res) => {
    res.json({ message: "Hello, world!" }).status(200)
}

module.exports = {
    test
}