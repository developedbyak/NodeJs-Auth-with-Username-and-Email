const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL_LOCAL);
        console.log("MondoDB Connected:");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDB;
