import jwt from "jsonwebtoken"

const findid = async (req, res, next) => {
    try {
        // console.log(1)
        // console.log(req.cookies)
        const token = req.cookies.token;

        // console.log(token)
        if (!token) {
            return res.status(402).json({ error: "Please Login first" })
        }
        // console.log(2)
        const decoded = await jwt.verify(token, "hgsfjahjf");

        if (!decoded) {
            return res.status(401).json({ error: "Invalid token" });
        }
        // console.log(3)
        if(decoded.type === "Tradeperson"){
            // console.log(4)
            return res.status(401).json({ message: "Login with Resident Account" });
        }
        req.id = decoded.id;
        // console.log(decoded.type)
        req.t = decoded.type
        console.log(req.id)
        next()
    } catch (err) {
        res.status(401).json({ error: "Invalid token" })
        console.log(err);
    }
}

export default findid;