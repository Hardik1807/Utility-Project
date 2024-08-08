import bc from "bcryptjs";
import express from "express";
import Tradeperson from "../models/tradepersonmodel.js";
import Resident from "../models/residentmodel.js";
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer';
import mongoose from "mongoose";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
});

const router = express.Router();

router.use(express.json());

const otps = {};

router.route('/signup').post(async (req, res) => {
    try {
        const { FullName, email, Password, Address, mobileNumber, type } = req.body;
        console.log(FullName, email, Password, Address, mobileNumber, type);

        if (!FullName || !email || !Address || !mobileNumber || !Password || !type) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (type === "Tradeperson") {
            const existingUser = await Tradeperson.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists. Please login" });
            }
        } else {
            const existingUser = await Resident.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists. Please login" });
            }
        }

        const otp = Math.floor(1000 + Math.random() * 9000);

        otps[email] = otp;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hardikhemnani2@gmail.com',
                pass: 'hxeb mnvt noil ldjf'
            }
        });

        const mailOptions = {
            from: 'hardikhemnani2@gmail.com',
            to: email,
            subject: 'Your OTP for Registration',
            text: `Your OTP for registration is ${otp}.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                return res.status(500).json({ message: "Error sending email" });
            } else {
                console.log('Email sent:', info.response);
                return res.status(201).json({ message: "OTP sent on Mail" });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
);
router.route('/login').post(async (req, res) => {
    try {
        const { email, Password, type } = req.body;
        console.log(email, Password, type)
        let user;
        if (!email || !Password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (type == "Tradeperson") {
            user = await Tradeperson.findOne({ email: email });
            if (!user) {
                return res.status(400).json({ message: "User does not exist. Please signup" });
            }
        } else {
            user = await Resident.findOne({ email: email });
            if (!user) {
                return res.status(400).json({ message: "User does not exist. Please signup" });
            }
        }

        let ispasstrue = await bc.compare(Password, user.Password);

        if (!ispasstrue) {
            return res.status(400).json({ message: "Incorrect Email or Password" });
        }

        const tokendata = {
            id: user._id,
            type: type
        };

        const token = jwt.sign(tokendata, "hgsfjahjf", { expiresIn: '2d' });

        return res.status(200).cookie("token", token, { maxAge: 24 * 60 * 60 * 1000 }).json({
            _id: user._id,
            fullname: user.FullName,
            email: user.email,
            message: "Login is done successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
);
router.route('/finalregister').post(upload.single('file'), async (req, res) => {
    try {
        const { FullName, email, Password, Address, mobileNumber, OTP, type, profession } = req.body;
        console.log(FullName, email, Password, Address, mobileNumber, type, profession);
        const profilePhotoFile = req.file;

        console.log(profilePhotoFile);

        if (OTP != otps[email]) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        
        const hashedPassword = await bc.hash(Password, 10);
        
        if (type == "Tradeperson") {
            const professionCollection = mongoose.connection.collection('profession');
    
            const professionExists = await professionCollection.findOne({ profession:profession.toLowerCase() });
            if (!professionExists) {
                await professionCollection.insertOne({ profession:profession.toLowerCase() });
            }
            const imagePath = 'C:\\Users\\hardi\\OneDrive\\Desktop\\utility_project\\uploads\\' + profilePhotoFile.filename;

            console.log('Uploaded File Path:', imagePath);
            const imageData = fs.readFileSync(imagePath);
            const img64 = imageData.toString('base64');

            fs.unlinkSync(imagePath);

            const newTradeperson = new Tradeperson({
                FullName,
                email,
                Password: hashedPassword,
                Address,
                mobileNumber,
                profilePhoto: img64,
                profession: profession.toLowerCase()
            });

            await newTradeperson.save();
        } else {
            const newResident = new Resident({
                FullName,
                email,
                Password: hashedPassword,
                Address,
                mobileNumber
            });

            await newResident.save();
        }

        delete otps[email];
        console.log(otps)

        return res.status(200).json({ message: "Registration successful" });

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
);
router.route('/logout').get(async (req, res) => {
    try {

        res.clearCookie("token").json({
            message: "Logged out successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
);

export default router;
