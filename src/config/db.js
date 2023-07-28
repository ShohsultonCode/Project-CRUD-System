const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://shohsultoncode:123326125@shop.iobzkwq.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
    });

    console.log(`MongoDB connected to: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
