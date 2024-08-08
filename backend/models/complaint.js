import mongoose from "mongoose";

const complaintModel = new mongoose.Schema({
    resident: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resident',
        required: true,
      },
    tradeperson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tradeperson',
        required: true,
      },
    preferredTime: {
        type: String, // or Date if you prefer
        required: true,
      },
    description: {
        type: String,
        required: true,
      },
    isAccepted: {
        type: Boolean,
        default: false,
      },
});

const Complaint = mongoose.model("Complaint", complaintModel);
export default Complaint;