import mongoose from "mongoose";

const residentModel = new mongoose.Schema({
    FullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address.']
    },
    Password: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'] 
    }
});

const Resident = mongoose.model("Resident", residentModel);
export default Resident;