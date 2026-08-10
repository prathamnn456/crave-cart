import jwt from "jsonwebtoken";

// admin login — verifies against ADMIN_EMAIL / ADMIN_PASSWORD in .env
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, { expiresIn: "1d" });
            return res.json({ success: true, token });
        }
        return res.json({ success: false, message: "Invalid admin credentials" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { adminLogin };
