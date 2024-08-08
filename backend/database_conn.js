import mongoose from "mongoose";

const connectdb = () => {
    return mongoose.connect("mongodb://127.0.0.1:27017/Utility_project")
        .then(() => {
            console.log("Database connected");
        })
        .catch((err) => {
            console.error("Database connection error:", err);
        });
};

export default connectdb;
