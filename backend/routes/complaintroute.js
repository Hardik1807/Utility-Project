import mongoose from "mongoose";
import express from "express"
import findidtype from "../middleware/findidtype.js";
import findid from "../middleware/findid.js"
import Complaint from "../models/complaint.js"
import Tradeperson from '../models/tradepersonmodel.js';
import nodemailer from 'nodemailer';

const router = express.Router();
router.use(express.json())

router.route("/registercomplaint").post(findid, async (req, res) => {
    try {
        const { profession, preferredTime, professional, description } = req.body;

        let residentID = req.id

        const existingComplaint = await Complaint.findOne({
            resident: residentID,
            tradeperson: professional
        });

        if (existingComplaint) {
            return res.status(400).json({ message: "Complaint Already Exists" });
        }

        const newComplaint = new Complaint({
            resident: residentID,
            tradeperson: professional,
            preferredTime,
            description
        });

        await newComplaint.save();

        const tradeperson = await Tradeperson.findOne({ _id: professional });

        if(tradeperson)
        {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'hardikhemnani2@gmail.com',
                    pass: 'hxeb mnvt noil ldjf'
                }
            });

            const mailOptions = {
                from: 'hardikhemnani2@gmail.com',
                to: tradeperson.email,
                subject: 'Complaint Revoked',
                text: `Dear ${tradeperson.FullName},\n\nYou have recieved a request for service.Check on site.\n\nBest regards,\nYour Team`
            };

            transporter.sendMail(mailOptions);

        }

        res.status(201).json({ message: "Complaint Registered Successfully" });

    } catch (error) {
        console.error("Hi", error)
        res.send("Server Error")
    }

});

router.route("/getcomplaint").get(findidtype, async (req, res) => {
    try {
        const complaints = await Complaint.find({
            $or: [
                { resident: req.id },
                { tradeperson: req.id }
            ]
        }).populate({
                path: 'resident',
                select: 'FullName'
            })
            .populate({
                path: 'tradeperson',
                select: 'FullName'
            });

        res.status(200).send([complaints, req.t]);
    } catch (error) {
        console.error("Error fetching complaints:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.route("/:action").post(findidtype, async (req, res) => {
    const { id } = req.body;
    const userType = req.t;
    const action = req.params.action;
    // console.log(id, action, userType);

    try {
        const complaint = await Complaint.findById(id).populate('resident').populate("tradeperson");

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        if (userType === 'Resident') {
            
            if (action === 'revoke') {
                const tradeperson = complaint.tradeperson;
                if (tradeperson) {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'hardikhemnani2@gmail.com',
                            pass: 'hxeb mnvt noil ldjf'
                        }
                    });

                    const mailOptions = {
                        from: 'hardikhemnani2@gmail.com',
                        to: tradeperson.email,
                        subject: 'Complaint Revoked',
                        text: `Dear ${tradeperson.FullName},\n\nWe regret to inform you that your complaint with ID ${id} has been Revoked.\n\nBest regards,\nYour Team`
                    };

                    transporter.sendMail(mailOptions);
                }

                if (tradeperson) {
                    console.log(tradeperson._id)
                    const preferredTime = complaint.preferredTime;
                    await Tradeperson.findByIdAndUpdate(tradeperson._id, {
                        $set: { [`availability.${preferredTime}`]: 0 }
                    });
                }

                await Complaint.findByIdAndDelete(id);
                return res.status(200).json({ message: "Complaint revoked successfully" });
            }
            else {
                return res.status(400).json({ message: "Invalid action for Resident" });
            }
        } else if (userType === 'Tradeperson') {
            if (action === 'accept') {
                if (complaint.isAccepted === false) {
                    await Complaint.findByIdAndUpdate(id, { isAccepted: true });

                    const tradeperson = complaint.tradeperson;
                    if (tradeperson) {
                        const preferredTime = complaint.preferredTime;
                        await Tradeperson.findByIdAndUpdate(tradeperson._id, {
                            $set: { [`availability.${preferredTime}`]: 1 }
                        });
                    }

                    return res.status(200).json({ message: `Complaint accepted successfully` });
                } else {
                    return res.status(400).json({ message: "Complaint already accepted or denied" });
                }
            } else if (action === 'deny') {
                const resident = complaint.resident;
                if (resident) {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'hardikhemnani2@gmail.com',
                            pass: 'hxeb mnvt noil ldjf'
                        }
                    });

                    const mailOptions = {
                        from: 'hardikhemnani2@gmail.com',
                        to: resident.email,
                        subject: 'Complaint Denied',
                        text: `Dear ${resident.FullName},\n\nWe regret to inform you that your complaint with ID ${id} has been denied.Tell some other time or worker.\n\nBest regards,\nYour Team`
                    };

                    transporter.sendMail(mailOptions);
                }

                const tradeperson = complaint.tradeperson;

                if (tradeperson) {
                    const preferredTime = complaint.preferredTime;
                    await Tradeperson.findByIdAndUpdate(tradeperson._id, {
                        $set: { [`availability.${preferredTime}`]: 0 }
                    });
                }

                await Complaint.findByIdAndDelete(id);
                return res.status(200).json({ message: "Complaint denied and deleted successfully" });
            } else {
                return res.status(400).json({ message: "Invalid action for Tradeperson" });
            }
        } else {
            return res.status(403).json({ message: "Unauthorized action" });
        }
    } catch (error) {
        console.error("Error processing action:", error);
        return res.status(500).json({ message: "Server Error" });
    }
});

router.route("/resident/not_arrived").post(findidtype, async (req, res) => {
    const { id } = req.body;
    const userType = req.t;

    try {
        const complaint = await Complaint.findById(id).populate('resident').populate("tradeperson");

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        if (userType == "Resident") {

            if (complaint.isAccepted) {
                const preferredTime = complaint.preferredTime.split('-')[0];
                const currentTime = new Date().getHours();

                console.log(currentTime, preferredTime)

                if (currentTime >= preferredTime) {
                    const tradeperson = complaint.tradeperson;
                    if (tradeperson) {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'hardikhemnani2@gmail.com',
                                pass: 'hxeb mnvt noil ldjf'
                            }
                        });

                        const mailOptions = {
                            from: 'hardikhemnani2@gmail.com',
                            to: tradeperson.email,
                            subject: 'Complaint Revoked',
                            text: `Dear ${tradeperson.FullName},\nWe regret to inform you that your complaint with ID ${id} has been canceled due to your failure to arrive on time. This will adversely affect your rating.\n\nBest regards,\nYour Team`
                        };

                        transporter.sendMail(mailOptions);
                    }

                    const resident = complaint.resident;
                    if (resident) {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'hardikhemnani2@gmail.com',
                            pass: 'hxeb mnvt noil ldjf'
                        }
                    });

                    const mailOptions = {
                        from: 'hardikhemnani2@gmail.com',
                        to: resident.email,
                        subject: 'Complaint Denied',
                        text: `Dear ${resident.FullName},\nWe regret to inform you that your complaint with ID ${id} has been canceled. We apologize for the inconvenience caused by the professional not arriving on time. Please feel free to reschedule for another time or request a different worker. We assure you that this will not happen again.\n\nBest regards,\nYour Team`
                    };
                    transporter.sendMail(mailOptions);
                }


                    if (tradeperson) {
                        console.log(tradeperson._id)
                        const preferredTime = complaint.preferredTime;
                        await Tradeperson.findByIdAndUpdate(tradeperson._id, {
                            $set: { [`availability.${preferredTime}`]: 0 }
                        });
                    }

                    await Complaint.findByIdAndDelete(id);
                    return res.status(200).json({ message: "Sorry For inconvinence." });

                    // return res.status(200).json({ message: "Action performed successfully" });
                } else {
                    return res.status(400).json({ message: "Current time is less than preferred time" });
                }
            } else {
                return res.status(400).json({ message: "Complaint is not accepted" });
            }

        }
        else {
            return res.status(403).json({ message: "Unauthorized action" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});


router.route("/resident/work_complete").post(findidtype, async (req, res) => {
    const { id , rating } = req.body;
    const userType = req.t;

    try {

        const complaint = await Complaint.findById(id).populate('resident').populate("tradeperson");

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        if (userType == "Resident") {

            if (complaint.isAccepted) {
                const tradeperson = complaint.tradeperson;
                if (tradeperson) {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'hardikhemnani2@gmail.com',
                            pass: 'hxeb mnvt noil ldjf'
                        }
                    });
        
                    const mailOptions = {
                        from: 'hardikhemnani2@gmail.com',
                        to: tradeperson.email,
                        subject: 'Complaint Solved',
                        text: `Dear ${tradeperson.FullName},\n\nWe regret to inform you that your complaint with ID ${id} has been solved.\n\nBest regards,\nYour Team`
                    };
        
                    transporter.sendMail(mailOptions);
                }
        
                if (tradeperson) {
                    const preferredTime = complaint.preferredTime;
                    await Tradeperson.findByIdAndUpdate(tradeperson._id, {
                        $set: { [`availability.${preferredTime}`]: 0 }
                    });
                }
        
                // Calculate new rating
                const { rating: currentRating, reviews: currentReviews } = tradeperson;
                const newRating = rating; 
                const updatedReviews = currentReviews + 1;
                const updatedRating = ((currentRating * currentReviews) + newRating) / updatedReviews;
        
                await Tradeperson.findByIdAndUpdate(tradeperson._id, {
                    $set: { rating: updatedRating, reviews: updatedReviews }
                });
        
                await Complaint.findByIdAndDelete(id);
                return res.status(200).json({ message: 'Complaint solved successfully' });

            } else {
                return res.status(400).json({ message: "Complaint is not accepted" });
            }

        }
        else {
            return res.status(403).json({ message: "Unauthorized action" });
        }
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});


export default router;