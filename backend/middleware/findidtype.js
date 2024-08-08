import jwt from "jsonwebtoken"

const findidtype = async (req, res, next) => {
    try {
        // console.log(1)
        // console.log(req.cookies)
        const token = req.cookies.token;

        // console.log(token)
        if (!token) {
            return res.status(402).json({ error: "Please Login first" })
        }

        const decoded = await jwt.verify(token, "hgsfjahjf");

        if (!decoded) {
            return res.status(401).json({ error: "Invalid token" });
        }

        req.id = decoded.id;
        // console.log(decoded.type)
        req.t = decoded.type
        // console.log(req.id)
        next()
    } catch (err) {
        res.status(401).json({ error: "Invalid token" })
        console.log(err);
    }
}

export default findidtype;