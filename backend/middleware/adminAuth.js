import jwt from "jsonwebtoken";

// protects admin-only endpoints — requires a token signed with role "admin"
const adminAuth = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Not authorized. Please log in as admin." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin") {
            return res.json({ success: false, message: "Admin access only." });
        }
        next();
    } catch (error) {
        return res.json({ success: false, message: "Session expired. Please log in again." });
    }
};

export default adminAuth;
