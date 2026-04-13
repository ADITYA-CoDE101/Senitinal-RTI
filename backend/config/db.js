const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/SentinalRTI');
        console.log("Database connected successfully");
    } catch (error) {
        console.log(" [ ERROE 1 ]: ",error);
    }
}

module.exports = dbConnect;