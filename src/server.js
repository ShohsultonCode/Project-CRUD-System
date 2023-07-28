require("express-async-errors")
require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const fileUpload = require("express-fileupload");
const path = require('path')
const cors = require('cors');
const PORT = process.env.PORT || 5000


//Connect to database
connectDB()


const app = express()

app.use(cors({ origin: "*" }));
app.use('/images', express.static('uploads'));
app.use(express.json())
app.use(fileUpload())




app.use('/api', require('./routes'))


app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use((error, req, res, next) => {
    if (error) {
        return res.status(500).json({ message: error.message })
    }
    next()
})



app.listen(PORT, console.log(`Server listening on port: ${PORT}`))

module.exports = app