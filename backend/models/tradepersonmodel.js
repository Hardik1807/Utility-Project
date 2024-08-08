import mongoose from "mongoose";

const TradepersonModel = new mongoose.Schema({
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
        required: true,
    },
    profilePhoto: {
        type: String,
        // required: true
        default: ""
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
    },
    profession:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        default : 0
    },
    reviews : {
        type:Number,
        default : 0
    },
    availability: {
        type: Object,
        default: {
            "9-10": 0,
            "10-11": 0,
            "11-12": 0,
            "12-13": 0,
            "13-14": 0,
            "14-15": 0,
            "15-16": 0,
            "16-17": 0,
            "17-18": 0
        },
    }
});

const Tradeperson = mongoose.model("Tradeperson", TradepersonModel);
export default Tradeperson;