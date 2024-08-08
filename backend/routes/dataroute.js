import mongoose from "mongoose";
import express from "express"
const router = express.Router();
router.use(express.json())

router.route("/getprofessional").get(async (req, res) => {

    try {
        // console.log("Hi")
        const professionCollection = mongoose.connection.collection('profession');
        const professionalsCollection = mongoose.connection.collection('tradepeople');
        const professionals =await professionalsCollection.find({}, { projection: { profilePhoto: 0 } }).toArray()
        const profession =await professionCollection.find({}).toArray()

        // console.log(profession, professionals)

        res.send([profession, professionals])

      } catch (error) {
        console.error("Hi",error)
        res.send("Server Error")
    
      }

});


export default router;
