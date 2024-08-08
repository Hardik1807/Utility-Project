import express from "express";
import connectdb from "./database_conn.js"; 
import userroute from "./routes/userroute.js"
import cookieParser from "cookie-parser";
import dataroute from "./routes/dataroute.js"
import complaintroute from './routes/complaintroute.js'
import cors from 'cors';

const app = express();
const PORT = 8000;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use("/user",userroute);
app.use("/data",dataroute);
app.use("/complaint",complaintroute);

app.listen(PORT, () => {
    connectdb();
    console.log(`Server is running on port ${PORT}`);
});

